// ─── NIK Validator ─────────────────────────────────────────
export function isValidNIK(nik: string): boolean {
  // Check length
  if (nik.length !== 16) {
    return false;
  }

  // Check if all characters are digits
  if (!/^\d+$/.test(nik)) {
    return false;
  }

  // Extract components
  const provinsi = parseInt(nik.substring(0, 2));
  const kabupaten = parseInt(nik.substring(2, 4));
  const kecamatan = parseInt(nik.substring(4, 6));
  const tanggal = parseInt(nik.substring(6, 8));
  const bulan = parseInt(nik.substring(8, 10));
  const tahun = parseInt(nik.substring(10, 12));

  // Validate provinsi (01-94)
  if (provinsi < 1 || provinsi > 94) {
    return false;
  }

  // Validate tanggal (01-31 atau 41-71 untuk perempuan)
  const tanggalNormal = tanggal > 40 ? tanggal - 40 : tanggal;
  if (tanggalNormal < 1 || tanggalNormal > 31) {
    return false;
  }

  // Validate bulan (01-12)
  if (bulan < 1 || bulan > 12) {
    return false;
  }

  // Additional validation: check if date is valid
  const currentYear = new Date().getFullYear() % 100;
  const birthYear = tahun > currentYear ? 1900 + tahun : 2000 + tahun;
  const fullDate = new Date(birthYear, bulan - 1, tanggalNormal);

  if (
    fullDate.getDate() !== tanggalNormal ||
    fullDate.getMonth() !== bulan - 1
  ) {
    return false;
  }

  return true;
}

/**
 * Format NIK for display (XXXX XXXX XXXX XXXX)
 */
export function formatNIK(nik: string): string {
  if (!nik) return '';
  return nik.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

/**
 * Extract birth date from NIK
 */
export function extractBirthDateFromNIK(nik: string): Date | null {
  if (!isValidNIK(nik)) {
    return null;
  }

  let tanggal = parseInt(nik.substring(6, 8));
  const bulan = parseInt(nik.substring(8, 10));
  const tahun = parseInt(nik.substring(10, 12));

  // Adjust for female (tanggal + 40)
  if (tanggal > 40) {
    tanggal -= 40;
  }

  const currentYear = new Date().getFullYear() % 100;
  const birthYear = tahun > currentYear ? 1900 + tahun : 2000 + tahun;

  return new Date(birthYear, bulan - 1, tanggal);
}

/**
 * Extract gender from NIK
 */
export function extractGenderFromNIK(nik: string): 'L' | 'P' | null {
  if (!isValidNIK(nik)) {
    return null;
  }

  const tanggal = parseInt(nik.substring(6, 8));
  return tanggal > 40 ? 'P' : 'L';
}

/**
 * Extract province code from NIK
 */
export function extractProvinceCodeFromNIK(nik: string): string | null {
  if (!isValidNIK(nik)) {
    return null;
  }

  return nik.substring(0, 2);
}

/**
 * Calculate age from NIK
 */
export function calculateAgeFromNIK(nik: string): number | null {
  const birthDate = extractBirthDateFromNIK(nik);
  if (!birthDate) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Mask NIK for privacy (show only first 4 and last 4 digits)
 */
export function maskNIK(nik: string): string {
  if (nik.length !== 16) {
    return nik;
  }

  return `${nik.substring(0, 4)} **** **** ${nik.substring(12)}`;
}

export function getNIKInfo(nik: string): {
  provinceCode: string;
  districtCode: string;
  subdistrictCode: string;
  birthDate: string;
  gender: 'male' | 'female';
  sequenceNumber: string;
} | null {
  if (!isValidNIK(nik)) return null;

  const day = parseInt(nik.substring(6, 8), 10);
  const month = nik.substring(8, 10);
  const year = nik.substring(10, 12);
  const fullYear = parseInt(year, 10) < 50 ? '20' + year : '19' + year;

  const actualDay = day > 40 ? day - 40 : day;
  const gender: 'male' | 'female' = day > 40 ? 'female' : 'male';

  return {
    provinceCode: nik.substring(0, 2),
    districtCode: nik.substring(2, 4),
    subdistrictCode: nik.substring(4, 6),
    birthDate: `${fullYear}-${month}-${actualDay.toString().padStart(2, '0')}`,
    gender,
    sequenceNumber: nik.substring(12, 16),
  };
}

// ─── Email Validator ───────────────────────────────────────
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ─── Phone Number Validator ────────────────────────────────
export function isValidPhoneNumber(phone: string): boolean {
  // Indonesian phone number format: 08xx-xxxx-xxxx or +628xx-xxxx-xxxx
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format to 08xx-xxxx-xxxx
  if (cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  // Format +62 8xx-xxxx-xxxx
  if (cleaned.startsWith('62')) {
    return '+' + cleaned.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '$1 $2-$3-$4');
  }

  return phone;
}

// ─── Name Validator ────────────────────────────────────────
export function isValidName(name: string): boolean {
  // Name should only contain letters, spaces, and common Indonesian characters
  const nameRegex = /^[a-zA-Z\s.']+$/;
  return nameRegex.test(name) && name.trim().length >= 3;
}

// ─── Date Validator ────────────────────────────────────────
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export function isAdult(birthDate: string, minAge: number = 17): boolean {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= minAge;
  }

  return age >= minAge;
}

// ─── Password Validator ────────────────────────────────────
export function isValidPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password minimal 8 karakter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password harus mengandung huruf besar');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password harus mengandung huruf kecil');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password harus mengandung angka');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password harus mengandung karakter khusus');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ─── URL Validator ─────────────────────────────────────────
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ─── Export All ────────────────────────────────────────────
export const validators = {
  isValidNIK,
  getNIKInfo,
  isValidEmail,
  isValidPhoneNumber,
  formatPhoneNumber,
  isValidName,
  isValidDate,
  isAdult,
  isValidPassword,
  isValidURL,
};
