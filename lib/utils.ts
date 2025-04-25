import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AuditLogger } from "./audit-logger"
import { headers } from "next/headers"
import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { toast } from "@/hooks/use-toast"
import { prisma } from "@/lib/prisma"
import { getAuthErrorMessage } from "@/lib/auth-errors"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ApiError = {
  code: string
  message: string
  details?: Record<string, any>
}

export class ApiException extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'ApiException'
  }

  toJSON(): ApiError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    }
  }
}

interface ErrorResponse {
  message: string
  code?: string
  field?: string
  details?: any
}

export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options?: {
    validation?: z.ZodSchema
    data?: FormData | any
  }
): Promise<T> {
  try {
    // Validate input data if schema provided
    if (options?.validation && options?.data) {
      const formData = options.data instanceof FormData
        ? Object.fromEntries(options.data.entries())
        : options.data

      try {
        options.validation.parse(formData)
      } catch (e) {
        if (e instanceof z.ZodError) {
          const firstError = e.errors[0]
          throw {
            message: firstError.message,
            code: "VALIDATION_ERROR",
            field: firstError.path.join("."),
            details: e.errors
          }
        }
        throw e
      }
    }

    return await fn()
  } catch (error: any) {
    // Format known error types
    const formattedError: ErrorResponse = formatError(error)
    
    // Log error for monitoring
    console.error("Operation failed:", {
      error: formattedError,
      originalError: error,
      timestamp: new Date().toISOString()
    })

    throw formattedError
  }
}

function formatError(error: any): ErrorResponse {
  // Already formatted error
  if (error.code && error.message) {
    return error
  }

  // Database errors
  if (error?.code?.startsWith('23')) {
    return handleDatabaseError(error)
  }

  // Authentication errors
  if (error?.status === 401 || error?.name === 'AuthError') {
    return {
      message: 'Authentication required',
      code: 'AUTH_ERROR'
    }
  }

  // Permission errors
  if (error?.status === 403) {
    return {
      message: 'Permission denied',
      code: 'PERMISSION_ERROR'
    }
  }

  // Not found errors
  if (error?.status === 404) {
    return {
      message: 'Resource not found',
      code: 'NOT_FOUND'
    }
  }

  // Generic error
  return {
    message: error?.message || 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    details: process.env.NODE_ENV === 'development' ? error : undefined
  }
}

function handleDatabaseError(error: any): ErrorResponse {
  switch (error.code) {
    case '23505': // unique violation
      return {
        message: 'This record already exists',
        code: 'DUPLICATE_ERROR',
        field: error.constraint
      }
    case '23503': // foreign key violation
      return {
        message: 'Referenced record does not exist',
        code: 'REFERENCE_ERROR',
        field: error.constraint
      }
    case '23502': // not null violation
      return {
        message: 'Required field is missing',
        code: 'NULL_ERROR',
        field: error.column
      }
    default:
      return {
        message: 'Database error occurred',
        code: 'DB_ERROR',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }
  }
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount)
}

export function formatNumber(number: number): string {
  return new Intl.NumberFormat('en').format(number)
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function calculateDateDifference(start: Date, end: Date): string {
  const diffInMilliseconds = end.getTime() - start.getTime()
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours`
  }
  
  const diffInDays = diffInHours / 24
  return `${Math.floor(diffInDays)} days`
}

export function validateShiftDuration(start: Date, end: Date): boolean {
  const maxShiftHours = 12
  const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  return diffInHours <= maxShiftHours
}

export function validateMeterReading(opening: number, closing: number): boolean {
  return closing > opening && closing - opening <= 10000 // Reasonable max liters per reading
}

export function validateCashAmount(amount: number): boolean {
  return amount > 0 && amount <= 10000000 // Reasonable max amount
}

export function calculateExpectedAmount(litersSold: number, pricePerLiter: number): number {
  return Math.round((litersSold * pricePerLiter) * 100) / 100
}

export function calculateCashVariance(expected: number, actual: number): number {
  return Math.round((actual - expected) * 100) / 100
}

export function calculateDayTotal(amounts: number[]): number {
  return amounts.reduce((sum, amount) => sum + amount, 0)
}

export function groupTransactionsByDate(transactions: any[]): Record<string, any[]> {
  return transactions.reduce((groups: Record<string, any[]>, transaction) => {
    const date = new Date(transaction.created_at).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(transaction)
    return groups
  }, {})
}

export function calculateRunningBalance(transactions: any[]): any[] {
  let balance = 0
  return transactions.map(transaction => {
    balance += transaction.type === 'credit' ? transaction.amount : -transaction.amount
    return { ...transaction, balance }
  })
}

export function validateReferenceNumber(reference: string): boolean {
  // Implement specific validation rules for your payment reference numbers
  const validFormats = [
    /^[A-Z]{2}\d{10}$/, // e.g., TX1234567890
    /^\d{16}$/, // e.g., 1234567890123456
    /^[A-Z]{3}\d{7}[A-Z]$/ // e.g., POS1234567X
  ]
  return validFormats.some(format => format.test(reference))
}

export function sanitizeAmount(amount: string | number): number {
  const cleaned = typeof amount === 'string' 
    ? amount.replace(/[^0-9.]/g, '')
    : amount.toString()
  return Math.round(parseFloat(cleaned) * 100) / 100
}

export function maskPhoneNumber(phone: string): string {
  return phone.replace(/(\d{3})\d{6}(\d{2})/, '$1******$2')
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

export function generateReferenceNumber(): string {
  const prefix = 'TX'
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
  return `${prefix}${timestamp}${random}`
}

// Remove duplicate ValidationError class and keep the one with more features
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code: string = 'VALIDATION_ERROR',
    public details?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class BusinessError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = "BusinessError"
  }
}

// Remove the duplicate validatePhoneNumber function and keep the more feature-rich version
export const validatePhoneNumber = (phone: string) => {
  const phoneRegex = /^(\+234|0)[789][01]\d{8}$/
  if (!phoneRegex.test(phone)) {
    throw new ValidationError("Invalid phone number")
  }
  return phone
}

export const handleError = (error: unknown) => {
  if (error instanceof ValidationError) {
    toast({
      title: "Validation Error",
      description: error.message,
      variant: "destructive",
    })
    return
  }

  if (error instanceof BusinessError) {
    toast({
      title: "Business Rule Error",
      description: error.message,
      variant: "destructive",
    })
    return
  }

  if (error instanceof TRPCError) {
    toast({
      title: "Operation Failed",
      description: error.message,
      variant: "destructive",
    })
    return
  }

  if (error instanceof Error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    })
    return
  }

  // Handle unknown error type
  const errorMessage = error && typeof error === 'object' && 'message' in error
    ? String(error.message)
    : 'An unexpected error occurred'
    
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  })
}

// Common validation utilities
export const validateRequired = <T>(value: T | null | undefined, fieldName: string): T => {
  if (value === null || value === undefined) {
    throw new ValidationError(`${fieldName} is required`)
  }
  return value
}

export const validateMinLength = (value: string, minLength: number, fieldName: string) => {
  if (value.length < minLength) {
    throw new ValidationError(`${fieldName} must be at least ${minLength} characters long`)
  }
  return value
}

export const validateMaxLength = (value: string, maxLength: number, fieldName: string) => {
  if (value.length > maxLength) {
    throw new ValidationError(`${fieldName} must not exceed ${maxLength} characters`)
  }
  return value
}

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email address")
  }
  return email
}

export const validatePositiveNumber = (value: number, fieldName: string) => {
  if (value <= 0) {
    throw new ValidationError(`${fieldName} must be a positive number`)
  }
  return value
}

export const validateRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string
) => {
  if (value < min || value > max) {
    throw new ValidationError(`${fieldName} must be between ${min} and ${max}`)
  }
  return value
}

export const validateFutureDate = (date: Date, fieldName: string) => {
  if (date.getTime() < Date.now()) {
    throw new ValidationError(`${fieldName} must be in the future`)
  }
  return date
}

export const validatePastDate = (date: Date, fieldName: string) => {
  if (date.getTime() > Date.now()) {
    throw new ValidationError(`${fieldName} must be in the past`)
  }
  return date
}

// Business rule validations
export const validateBusinessHours = (date: Date) => {
  const hour = date.getHours()
  if (hour < 6 || hour >= 22) {
    throw new BusinessError(
      "Operation can only be performed during business hours (6 AM - 10 PM)",
      "OUTSIDE_BUSINESS_HOURS"
    )
  }
  return date
}

export const validateShiftActive = async (userId: string) => {
  const activeShift = await prisma.shift.findFirst({
    where: {
      userId: userId,
      shiftStatus: "ACTIVE"
    }
  })

  if (!activeShift) {
    throw new BusinessError("No active shift found", "NO_ACTIVE_SHIFT")
  }

  return activeShift
}

export const validateSufficientBalance = async (
  terminalId: string,
  tankId: string,
  amount: number
) => {
  const tank = await prisma.tank.findFirst({
    where: {
      id: tankId,
      terminalId: terminalId
    }
  })

  if (!tank) {
    throw new BusinessError("Tank not found", "TANK_NOT_FOUND")
  }

  // Check if withdrawal would put tank below minimum level
  if (tank.currentVolume - amount < tank.minVolume) {
    throw new BusinessError(
      `Insufficient balance. Available: ${tank.currentVolume - tank.minVolume} L, Requested: ${amount} L`,
      "INSUFFICIENT_BALANCE"
    )
  }

  return true
}

export const validateNoOverlappingShifts = async (
  userId: string,
  startTime: Date,
  endTime: Date
) => {
  // Check for any shifts that overlap with the given time range
  const overlappingShifts = await prisma.shift.findMany({
    where: {
      userId: userId,
      NOT: { shiftStatus: "CANCELLED" },
      OR: [
        {
          startTime: { lte: endTime },
          endTime: { gte: startTime }
        },
        {
          startTime: { lte: endTime },
          endTime: null
        }
      ]
    }
  })

  if (overlappingShifts.length > 0) {
    throw new BusinessError(
      "Cannot create shift that overlaps with existing shifts",
      "OVERLAPPING_SHIFTS"
    )
  }

  return true
}