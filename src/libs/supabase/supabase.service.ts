import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';

export interface Student {
  id: string;
  enrollment_number: string;
  password: string;
  name: string;
  course: string;
  department: string;
  semester: number;
  email?: string;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: any;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Supabase credentials not configured in environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  }

  /**
   * Authenticate a student using enrollment number and password
   */
  async authenticateStudent(enrollmentNumber: string, password: string): Promise<Student> {
    try {
      // Query students table
      const { data: students, error } = await this.supabase
        .from('students')
        .select('*')
        .eq('enrollment_number', enrollmentNumber)
        .single();

      if (error) {
        this.logger.warn(`Student lookup failed: ${error.message}`);
        throw new UnauthorizedException('Invalid enrollment number or password');
      }

      if (!students) {
        throw new UnauthorizedException('Invalid enrollment number or password');
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(password, students.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid enrollment number or password');
      }

      // Return student data without password
      const { password: _, ...studentData } = students;
      return studentData as Student;
    } catch (error: any) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Authentication error: ${error.message}`);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  /**
   * Get student by enrollment number
   */
  async getStudentByEnrollmentNumber(enrollmentNumber: string): Promise<Student> {
    try {
      const { data: student, error } = await this.supabase
        .from('students')
        .select('*')
        .eq('enrollment_number', enrollmentNumber)
        .single();

      if (error) {
        throw new Error(`Student not found: ${error.message}`);
      }

      if (!student) {
        throw new Error('Student not found');
      }

      // Return without password
      const { password: _, ...studentData } = student;
      return studentData as Student;
    } catch (error: any) {
      this.logger.error(`Failed to get student: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get student by ID
   */
  async getStudentById(id: string): Promise<Student> {
    try {
      const { data: student, error } = await this.supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Student not found: ${error.message}`);
      }

      if (!student) {
        throw new Error('Student not found');
      }

      // Return without password
      const { password: _, ...studentData } = student;
      return studentData as Student;
    } catch (error: any) {
      this.logger.error(`Failed to get student: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get subjects for a student based on course and semester
   */
  async getStudentSubjects(course: string, semester: number): Promise<any[]> {
    try {
      const { data: subjects, error } = await this.supabase
        .from('subjects')
        .select('*')
        .eq('course', course)
        .eq('semester', semester);

      if (error) {
        this.logger.warn(`Failed to fetch subjects: ${error.message}`);
        return [];
      }

      return subjects || [];
    } catch (error: any) {
      this.logger.error(`Error fetching subjects: ${error.message}`);
      return [];
    }
  }

  /**
   * Get timetable for a student based on course and semester
   */
  async getStudentTimetable(course: string, semester: number): Promise<any[]> {
    try {
      const { data: timetable, error } = await this.supabase
        .from('timetable')
        .select('*')
        .eq('course', course)
        .eq('semester', semester);

      if (error) {
        this.logger.warn(`Failed to fetch timetable: ${error.message}`);
        return [];
      }

      return timetable || [];
    } catch (error: any) {
      this.logger.error(`Error fetching timetable: ${error.message}`);
      return [];
    }
  }

  /**
   * Verify password hash
   */
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      this.logger.error('Password verification failed');
      return false;
    }
  }

  /**
   * Hash password (for admin purposes)
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Check if student exists
   */
  async studentExists(enrollmentNumber: string): Promise<boolean> {
    try {
      const { data: student, error } = await this.supabase
        .from('students')
        .select('id')
        .eq('enrollment_number', enrollmentNumber)
        .single();

      if (error) {
        return false;
      }

      return !!student;
    } catch (error) {
      return false;
    }
  }
}
