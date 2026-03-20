/*
  # Create translations table for AI translation history

  1. New Tables
    - `translations`
      - `id` (uuid, primary key) - Unique identifier for each translation
      - `source_lang` (text) - Source language code (e.g., 'ja', 'en')
      - `target_lang` (text) - Target language code (e.g., 'ja', 'en')
      - `source_text` (text) - Original text to translate
      - `translated_text` (text) - AI-translated result
      - `tone` (text) - Translation tone/style (casual, friendly, business, polite)
      - `created_at` (timestamptz) - Timestamp of translation
  
  2. Security
    - Enable RLS on `translations` table
    - Add policy to allow anyone to insert translations
    - Add policy to allow anyone to read translations (public access for demo)
    
  3. Indexes
    - Index on `created_at` for efficient history retrieval
*/

CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_lang text NOT NULL,
  target_lang text NOT NULL,
  source_text text NOT NULL,
  translated_text text NOT NULL,
  tone text NOT NULL DEFAULT 'casual',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert translations"
  ON translations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view translations"
  ON translations
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_translations_created_at ON translations(created_at DESC);