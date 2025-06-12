
-- Create enum types for better data consistency
CREATE TYPE public.difficulty_level AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'Expert');
CREATE TYPE public.mission_category AS ENUM ('OSINT', 'Network Analysis', 'Digital Forensics', 'Threat Intelligence', 'Malware Analysis', 'Cryptography');
CREATE TYPE public.user_rank AS ENUM ('Recon Trainee', 'Cipher Cadet', 'Gamma Node', 'Sigma-51', 'Command Entity', 'Delta Agent');
CREATE TYPE public.activity_type AS ENUM ('mission_completed', 'rank_promoted', 'hint_used', 'login', 'skill_improved', 'flag_submission');
CREATE TYPE public.skill_category AS ENUM ('Technical', 'Analytical', 'Intelligence', 'Forensics', 'Security');

-- Create users table (profiles table referencing auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  rank user_rank DEFAULT 'Recon Trainee',
  score INTEGER DEFAULT 0,
  avatar TEXT,
  completed_missions TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category skill_category NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  max_level INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_skills junction table
CREATE TABLE public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Create missions table
CREATE TABLE public.missions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty difficulty_level NOT NULL,
  points INTEGER NOT NULL CHECK (points >= 1 AND points <= 1000),
  estimated_time TEXT NOT NULL,
  category mission_category NOT NULL,
  flag TEXT NOT NULL,
  file_url TEXT,
  unlock_requirement TEXT REFERENCES public.missions(id),
  hints JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  mission_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mission_completions table
CREATE TABLE public.mission_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_id TEXT REFERENCES public.missions(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attempts INTEGER DEFAULT 1,
  hints_used INTEGER DEFAULT 0,
  points_earned INTEGER NOT NULL,
  time_spent INTEGER DEFAULT 0,
  flag_submitted TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, mission_id)
);

-- Create activities table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type activity_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for skills (public read access)
CREATE POLICY "Everyone can read skills" ON public.skills
  FOR SELECT TO authenticated USING (true);

-- Create RLS policies for user_skills
CREATE POLICY "Users can view own skills" ON public.user_skills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills" ON public.user_skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills" ON public.user_skills
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for missions (public read access for authenticated users)
CREATE POLICY "Authenticated users can read missions" ON public.missions
  FOR SELECT TO authenticated USING (true);

-- Create RLS policies for mission_completions
CREATE POLICY "Users can view own completions" ON public.mission_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions" ON public.mission_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for activities
CREATE POLICY "Users can view own activities" ON public.activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON public.activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_profiles_rank ON public.profiles(rank);
CREATE INDEX idx_profiles_score ON public.profiles(score DESC);
CREATE INDEX idx_missions_category ON public.missions(category);
CREATE INDEX idx_missions_difficulty ON public.missions(difficulty);
CREATE INDEX idx_missions_order ON public.missions(mission_order);
CREATE INDEX idx_mission_completions_user ON public.mission_completions(user_id);
CREATE INDEX idx_mission_completions_mission ON public.mission_completions(mission_id);
CREATE INDEX idx_activities_user ON public.activities(user_id, created_at DESC);
CREATE INDEX idx_activities_type ON public.activities(type, created_at DESC);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'Agent'));
  
  -- Create welcome activity
  INSERT INTO public.activities (user_id, type, title, description)
  VALUES (NEW.id, 'login', 'Recon Trainee Registered', 'Welcome to the Alien Recon Lab!');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update user rank based on completed missions
CREATE OR REPLACE FUNCTION public.update_user_rank()
RETURNS TRIGGER AS $$
DECLARE
  mission_count INTEGER;
  new_rank user_rank;
  old_rank user_rank;
BEGIN
  -- Get current rank
  SELECT rank INTO old_rank FROM public.profiles WHERE id = NEW.user_id;
  
  -- Count completed missions
  SELECT array_length(completed_missions, 1) INTO mission_count 
  FROM public.profiles WHERE id = NEW.user_id;
  
  -- Determine new rank
  IF mission_count >= 25 THEN
    new_rank := 'Delta Agent';
  ELSIF mission_count >= 20 THEN
    new_rank := 'Command Entity';
  ELSIF mission_count >= 15 THEN
    new_rank := 'Sigma-51';
  ELSIF mission_count >= 10 THEN
    new_rank := 'Gamma Node';
  ELSIF mission_count >= 5 THEN
    new_rank := 'Cipher Cadet';
  ELSE
    new_rank := 'Recon Trainee';
  END IF;
  
  -- Update rank if changed
  IF old_rank != new_rank THEN
    UPDATE public.profiles SET rank = new_rank WHERE id = NEW.user_id;
    
    -- Create rank promotion activity
    INSERT INTO public.activities (user_id, type, title, description, metadata)
    VALUES (NEW.user_id, 'rank_promoted', 'Rank Promotion', 
           'Promoted from ' || old_rank || ' to ' || new_rank || '!',
           json_build_object('oldRank', old_rank, 'newRank', new_rank, 'promotionMission', NEW.mission_id));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for rank updates
CREATE TRIGGER trigger_update_user_rank
  AFTER INSERT ON public.mission_completions
  FOR EACH ROW EXECUTE FUNCTION public.update_user_rank();
