from supabase import create_client
import os

SUPABASE_URL = "https://xilivqaejwkathgrvtmw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpbGl2cWFlandrYXRoZ3J2dG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNzIxMDcsImV4cCI6MjA1Nzk0ODEwN30.zg7LUttYcHHSpRE_nFN2cuzqAOr4oZhWJH3QgcPGXjE"
supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)