-- Fix security definer view warning by removing the view
-- We'll use direct queries with RLS instead
DROP VIEW IF EXISTS public.public_profiles;