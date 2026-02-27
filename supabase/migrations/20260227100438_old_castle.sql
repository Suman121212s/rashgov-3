/*
  # Create sections and products tables

  1. New Tables
    - `sections`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `image` (text)
      - `description` (text)
      - `created_at` (timestamp)
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `price` (numeric)
      - `image` (text)
      - `short_description` (text)
      - `full_description` (text)
      - `story` (text)
      - `technical_details` (jsonb)
      - `section_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  price numeric NOT NULL,
  image text NOT NULL,
  short_description text NOT NULL,
  full_description text NOT NULL,
  story text NOT NULL,
  technical_details jsonb DEFAULT '{}',
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to sections"
  ON sections
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to products"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Insert sample sections
INSERT INTO sections (name, slug, image, description) VALUES
('Himalayan Herbs', 'himalayan-herbs', 'https://images.pexels.com/photos/4198943/pexels-photo-4198943.jpeg?auto=compress&cs=tinysrgb&w=800', 'Pure medicinal herbs from high altitudes'),
('Aromatic Spices', 'aromatic-spices', 'https://images.pexels.com/photos/4198643/pexels-photo-4198643.jpeg?auto=compress&cs=tinysrgb&w=800', 'Traditional spices with authentic flavors'),
('Wellness Teas', 'wellness-teas', 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=800', 'Herbal blends for mind and body'),
('Essential Oils', 'essential-oils', 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800', 'Pure extracts for aromatherapy');

-- Insert sample products
INSERT INTO products (name, slug, price, image, short_description, full_description, story, technical_details, section_id) VALUES
('Pure Himalayan Shilajit', 'pure-himalayan-shilajit', 2499, 'https://images.pexels.com/photos/6191428/pexels-photo-6191428.jpeg?auto=compress&cs=tinysrgb&w=800', 'Premium quality Shilajit sourced from 18,000+ feet altitude', 'Our Pure Himalayan Shilajit is harvested from the pristine rocks of the Himalayas at altitudes exceeding 18,000 feet. This ancient superfood has been revered for centuries for its rejuvenating properties and ability to enhance vitality and stamina.', 'Deep in the heart of the Himalayas, where the air is thin and the peaks touch the sky, lies one of nature''s most precious gifts - Shilajit. Our collectors brave extreme conditions to harvest this mineral-rich resin that has been forming for millions of years.', '{"purity": "99.5%", "altitude": "18000+ feet", "processing": "Sun-dried", "shelf_life": "3 years", "origin": "Ladakh, India"}', (SELECT id FROM sections WHERE slug = 'himalayan-herbs')),
('Organic Kashmiri Saffron', 'organic-kashmiri-saffron', 4999, 'https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg?auto=compress&cs=tinysrgb&w=800', 'World''s finest saffron from Kashmir valleys', 'Hand-picked from the saffron fields of Kashmir, our organic saffron threads are known for their deep color, intense aroma, and superior quality. Each thread is carefully selected to ensure maximum potency and flavor.', 'In the mystical valleys of Kashmir, where purple flowers bloom for just a few weeks each year, skilled farmers hand-harvest the precious saffron threads at dawn. This labor of love has been passed down through generations, preserving the authentic taste and aroma that makes Kashmiri saffron legendary.', '{"grade": "Grade A+", "threads_per_gram": "450-500", "crocin_content": "250+", "processing": "Hand-picked", "origin": "Pampore, Kashmir"}', (SELECT id FROM sections WHERE slug = 'aromatic-spices')),
('Himalayan Pink Salt', 'himalayan-pink-salt', 299, 'https://images.pexels.com/photos/7426829/pexels-photo-7426829.jpeg?auto=compress&cs=tinysrgb&w=800', 'Pure rock salt from ancient sea beds', 'Mined from the ancient salt deposits of the Punjab region, our Himalayan Pink Salt is completely natural and unprocessed. Rich in minerals and trace elements, it adds a subtle flavor to your dishes while providing essential nutrients.', 'Millions of years ago, ancient seas covered the region that is now the Himalayas. As these waters evaporated, they left behind vast deposits of pure, mineral-rich salt. Today, we carefully extract this pink treasure from deep within the mountains, preserving its natural purity and beneficial properties.', '{"mineral_content": "84 trace minerals", "sodium_content": "98%", "processing": "Hand-mined", "crystal_size": "Fine to coarse", "origin": "Khewra, Pakistan"}', (SELECT id FROM sections WHERE slug = 'aromatic-spices')),
('Ashwagandha Root Powder', 'ashwagandha-root-powder', 599, 'https://images.pexels.com/photos/5835255/pexels-photo-5835255.jpeg?auto=compress&cs=tinysrgb&w=800', 'Premium adaptogenic herb for stress relief', 'Our Ashwagandha Root Powder is made from organically grown roots, carefully dried and ground to preserve maximum potency. Known as the "Indian Winter Cherry," this powerful adaptogen helps the body manage stress and promotes overall well-being.', 'In the arid regions of India, where the sun beats down relentlessly, grows a humble shrub with extraordinary powers. For over 3,000 years, Ayurvedic practitioners have revered Ashwagandha as a rasayana - a tonic that promotes longevity and vitality. Our farmers cultivate this sacred herb using traditional methods, ensuring each root contains the full spectrum of beneficial compounds.', '{"withanolides_content": "5%+", "processing": "Low-temperature dried", "mesh_size": "80-100", "organic_certified": true, "origin": "Rajasthan, India"}', (SELECT id FROM sections WHERE slug = 'himalayan-herbs')),
('Wild Forest Honey', 'wild-forest-honey', 899, 'https://images.pexels.com/photos/1638754/pexels-photo-1638754.jpeg?auto=compress&cs=tinysrgb&w=800', 'Raw unprocessed honey from wild bees', 'Collected from the deep forests of the Western Ghats, our Wild Forest Honey is completely raw and unprocessed. The bees forage on diverse wildflowers, creating a complex flavor profile rich in enzymes, antioxidants, and natural goodness.', 'Deep in the untouched forests of the Western Ghats, where ancient trees create a canopy of green, wild bees have been crafting liquid gold for millennia. Our honey collectors, following age-old traditions, carefully harvest this precious nectar without disturbing the natural ecosystem, ensuring both sustainability and purity.', '{"moisture_content": "18%", "processing": "Raw & unfiltered", "floral_source": "Multi-flora", "harvest_season": "Winter", "origin": "Western Ghats, India"}', (SELECT id FROM sections WHERE slug = 'wellness-teas')),
('Turmeric Curcumin Powder', 'turmeric-curcumin-powder', 449, 'https://images.pexels.com/photos/4198638/pexels-photo-4198638.jpeg?auto=compress&cs=tinysrgb&w=800', 'High-curcumin turmeric for maximum benefits', 'Our premium Turmeric Curcumin Powder is sourced from the finest turmeric rhizomes, carefully processed to retain maximum curcumin content. This golden spice has been treasured for its anti-inflammatory and antioxidant properties for thousands of years.', 'In the fertile soils of South India, where monsoon rains nurture the earth, grows the golden rhizome that has colored Indian cuisine and medicine for millennia. Our turmeric is harvested at peak maturity, when the curcumin content is highest, then traditionally processed to preserve its therapeutic compounds and vibrant color.', '{"curcumin_content": "6%+", "processing": "Traditional stone-ground", "color_value": "High", "organic_certified": true, "origin": "Tamil Nadu, India"}', (SELECT id FROM sections WHERE slug = 'aromatic-spices'));