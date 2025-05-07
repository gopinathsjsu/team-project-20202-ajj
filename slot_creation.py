from datetime import datetime, timedelta, time
from dataclasses import dataclass
from typing import List, Optional
import logging
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, ForeignKey, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
OPENING_TIME = time(11, 0)  # 11:00 AM
CLOSING_TIME = time(22, 0)  # 10:00 PM
LAST_BOOKING_TIME = time(21, 0)  # 9:00 PM
DAYS_TO_POPULATE = 7

# Database setup
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://jainam:1234567890@localhost:5432/restaurant_db')
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class RestaurantTable(Base):
    __tablename__ = "restaurant_table"

    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurant.id"))
    capacity = Column(Integer)
    table_number = Column(String)

class Restaurant(Base):
    __tablename__ = "restaurant"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    tables = relationship("RestaurantTable")

class AvailabilitySlot(Base):
    __tablename__ = "availability_slots"

    id = Column(Integer, primary_key=True, index=True)
    table_id = Column(Integer, ForeignKey("restaurant_table.id"))
    available_at = Column(DateTime, nullable=False)
    is_booked = Column(Boolean, default=False)

class AvailabilityService:
    def __init__(self):
        self.db = SessionLocal()

    def __del__(self):
        self.db.close()

    def populate_availability_slots(self):
        """Populate availability slots for all restaurants and their tables."""
        logger.info("Starting slot population...")
        
        try:
            # Clean up old slots first
            self.cleanup_old_slots()
            
            # Get date range
            today = datetime.now().date()
            last_day = today + timedelta(days=DAYS_TO_POPULATE)
            
            # Get all restaurants
            restaurants = self.db.query(Restaurant).all()
            
            # For each restaurant
            for restaurant in restaurants:
                logger.info(f"Processing restaurant: {restaurant.name}")
                
                # Get all tables for this restaurant
                restaurant_tables = self.db.query(RestaurantTable).filter(
                    RestaurantTable.restaurant_id == restaurant.id
                ).all()
                
                # For each table
                for table in restaurant_tables:
                    logger.info(f"Processing table {table.table_number} for {restaurant.name}")
                    
                    # For each date in the range
                    current_date = today
                    while current_date < last_day:
                        if not self.has_existing_slots_for_date(table, current_date):
                            self.populate_slots_for_table_and_date(table, current_date)
                        current_date += timedelta(days=1)
            
            # Commit all changes
            self.db.commit()
            logger.info("Successfully populated all slots")
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error populating slots: {str(e)}")
            raise

    def cleanup_old_slots(self):
        """Remove slots before today."""
        try:
            cutoff = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            self.db.query(AvailabilitySlot).filter(
                AvailabilitySlot.available_at < cutoff
            ).delete()
            self.db.commit()
            logger.info("Cleaned up old slots")
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error cleaning up old slots: {str(e)}")
            raise

    def has_existing_slots_for_date(self, table: RestaurantTable, date: datetime.date) -> bool:
        """Check if slots already exist for a table on a given date."""
        start_of_day = datetime.combine(date, time.min)
        end_of_day = datetime.combine(date, time.max)
        
        count = self.db.query(AvailabilitySlot).filter(
            AvailabilitySlot.table_id == table.id,
            AvailabilitySlot.available_at.between(start_of_day, end_of_day)
        ).count()
        
        return count > 0

    def populate_slots_for_table_and_date(self, table: RestaurantTable, date: datetime.date):
        """Create slots for a table on a specific date."""
        try:
            current_slot = datetime.combine(date, OPENING_TIME)
            end_time = datetime.combine(date, LAST_BOOKING_TIME)
            
            while current_slot <= end_time:
                new_slot = AvailabilitySlot(
                    table_id=table.id,
                    available_at=current_slot,
                    is_booked=False
                )
                self.db.add(new_slot)
                current_slot += timedelta(hours=1)
            
            self.db.commit()
            logger.info(f"Created slots for table {table.table_number} on {date}")
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating slots for table {table.table_number}: {str(e)}")
            raise

    def get_available_times(self, restaurant_id: int, date: datetime.date, 
                          party_size: int) -> List[datetime]:
        """Get available time slots for a restaurant on a given date."""
        start_of_day = datetime.combine(date, OPENING_TIME)
        end_of_day = datetime.combine(date, CLOSING_TIME)
        
        # Query available slots
        available_slots = self.db.query(AvailabilitySlot).join(
            RestaurantTable
        ).filter(
            RestaurantTable.restaurant_id == restaurant_id,
            RestaurantTable.capacity >= party_size,
            AvailabilitySlot.available_at.between(start_of_day, end_of_day),
            AvailabilitySlot.is_booked == False
        ).all()
        
        # Return unique times
        return sorted(set(slot.available_at for slot in available_slots))

def main():
    try:
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        
        # Initialize service
        service = AvailabilityService()
        
        # Populate slots
        service.populate_availability_slots()
        
        # Print available slots for tomorrow
        tomorrow = datetime.now().date() + timedelta(days=1)
        available_times = service.get_available_times(1, tomorrow, 4)
        
        print("\nAvailable slots for tomorrow (party of 4):")
        for time_slot in available_times:
            print(time_slot.strftime("%I:%M %p"))
            
    except Exception as e:
        logger.error(f"Error in main: {str(e)}")

if __name__ == "__main__":
    main() 