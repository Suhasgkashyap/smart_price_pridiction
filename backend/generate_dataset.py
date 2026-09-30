"""
Dataset generator for Smart House Price Predictor
Generates a realistic Indian real-estate dataset with 1,200 records.
Locations include Karnataka cities (Shivamogga, Bengaluru, Mysore, Mangalore, Hubli) 
and major metro hubs (Hyderabad, Pune, Chennai).
"""

import csv
import random
import os

LOCATIONS = {
    'Shivamogga': {'base_sqft': 3600, 'variance': 400},
    'Bengaluru': {'base_sqft': 6800, 'variance': 800},
    'Mysore': {'base_sqft': 4200, 'variance': 500},
    'Mangalore': {'base_sqft': 4500, 'variance': 550},
    'Hubli': {'base_sqft': 3400, 'variance': 450},
    'Hyderabad': {'base_sqft': 5800, 'variance': 700},
    'Pune': {'base_sqft': 6200, 'variance': 750},
    'Chennai': {'base_sqft': 6000, 'variance': 700},
}

PROPERTY_TYPES = {
    'Apartment': {'mult': 1.0, 'area_range': (650, 2400), 'bhk_weights': [1, 2, 2, 3, 3, 4], 'floors_range': (1, 15)},
    'Independent House': {'mult': 1.18, 'area_range': (1100, 3200), 'bhk_weights': [2, 3, 3, 4, 4], 'floors_range': (1, 3)},
    'Villa': {'mult': 1.45, 'area_range': (2000, 5000), 'bhk_weights': [3, 4, 4, 5, 6], 'floors_range': (1, 3)},
    'Penthouse': {'mult': 1.55, 'area_range': (2200, 4800), 'bhk_weights': [3, 4, 4, 5], 'floors_range': (4, 25)},
}

FURNISHING = {
    'Unfurnished': 0.94,
    'Semi-Furnished': 1.04,
    'Fully-Furnished': 1.15
}

def generate_records(count=1200):
    random.seed(42)
    records = []
    
    locations = list(LOCATIONS.keys())
    property_types = list(PROPERTY_TYPES.keys())
    furnishing_types = list(FURNISHING.keys())

    for _ in range(count):
        loc = random.choice(locations)
        loc_info = LOCATIONS[loc]
        
        prop_type = random.choices(
            property_types,
            weights=[0.48, 0.28, 0.16, 0.08]
        )[0]
        type_info = PROPERTY_TYPES[prop_type]

        # Area
        min_a, max_a = type_info['area_range']
        area = int(random.uniform(min_a, max_a) // 50 * 50)

        # Bedrooms based on area
        bhk_choices = type_info['bhk_weights']
        bhk = random.choice(bhk_choices)
        if area > 2800 and bhk < 3:
            bhk = 4
        elif area < 900 and bhk > 2:
            bhk = 1 or 2

        # Bathrooms (usually bhk or bhk - 1, min 1)
        bathrooms = max(1, min(bhk + random.choice([-1, 0, 1]), bhk + 1))

        # Property age (0 to 25 years)
        property_age = int(random.triangular(0, 25, 4))

        # Parking (0 to 3)
        if prop_type in ['Villa', 'Penthouse']:
            parking = random.choice([2, 3])
        elif area >= 1400:
            parking = random.choice([1, 2])
        else:
            parking = random.choice([0, 1])

        # Total Floors / Floor level
        f_min, f_max = type_info['floors_range']
        floors = random.randint(f_min, f_max)

        # Furnishing
        furnishing = random.choice(furnishing_types)

        # Realistic Base Price calculation
        base_rate = loc_info['base_sqft'] + random.uniform(-loc_info['variance'], loc_info['variance'])
        type_multiplier = type_info['mult']
        furnish_multiplier = FURNISHING[furnishing]
        
        # Age depreciation: -0.8% per year up to 20 years
        age_factor = max(0.78, 1.0 - (property_age * 0.009))
        
        # Bathroom and parking bonuses
        amenity_bonus = 1.0 + (parking * 0.02) + (bathrooms * 0.015)

        sqft_rate = base_rate * type_multiplier * furnish_multiplier * age_factor * amenity_bonus
        # Add realistic market noise (+- 4%)
        sqft_rate *= random.uniform(0.96, 1.04)

        raw_price = area * sqft_rate
        # Round price to nearest 10,000 for realistic market pricing
        price = int(round(raw_price / 10000) * 10000)

        records.append({
            'location': loc,
            'area': area,
            'bedrooms': bhk,
            'bathrooms': bathrooms,
            'property_age': property_age,
            'parking': parking,
            'floors': floors,
            'furnishing_status': furnishing,
            'property_type': prop_type,
            'price': price
        })

    return records

def save_csv(records, filepath):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    fieldnames = [
        'location', 'area', 'bedrooms', 'bathrooms', 
        'property_age', 'parking', 'floors', 
        'furnishing_status', 'property_type', 'price'
    ]
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)
    print(f"Successfully generated {len(records)} records at {filepath}")

if __name__ == '__main__':
    data = generate_records(1200)
    save_csv(data, 'backend/dataset/houses.csv')
