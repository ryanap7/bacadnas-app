/**
 * Certificate API Types
 */

// ─── Certificate Status Type ─────────────────────────────────
export type CertificateStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'PENDING';

// ─── Certificate Category Type ───────────────────────────────
export type CertificateCategory = 'KOMCAD' | 'BELA_NEGARA' | 'TRAINING' | 'OTHER';

// ─── Program Type ────────────────────────────────────────────
export type ProgramType = 'KOMCAD' | 'BELA_NEGARA';

// ─── Authenticity Item ───────────────────────────────────────
export interface AuthenticityItem {
    text: string;
    icon: string; // Ionicons name
}

// ─── Certificate Interface ───────────────────────────────────
export interface Certificate {
    id: string;
    createdAt: string; // ISO String
    updatedAt: string; // ISO String
    certificateNumber: string;
    title: string;
    description: string;
    category: CertificateCategory;
    issuedBy: string;
    issuedDate: string; // ISO String
    validUntil: string; // ISO String
    programType: ProgramType;
    batchNumber: string;
    authenticity: AuthenticityItem[];
    status: CertificateStatus;
    userId: string;
    programId: string;
}

// ─── Certificates List Response ──────────────────────────────
export interface CertificatesListResponse {
    status: 'success';
    message: string;
    data: Certificate[];
}

// ─── Certificate Detail Response ─────────────────────────────
export interface CertificateDetailResponse {
    status: 'success';
    message: string;
    data: Certificate;
}

// ─── Download Certificate Request ────────────────────────────
export interface DownloadCertificateRequest {
    certificateId: string;
    format?: 'PDF' | 'IMAGE';
}

// ─── Verify Certificate Request ──────────────────────────────
export interface VerifyCertificateRequest {
    certificateNumber: string;
}

export interface VerifyCertificateResponse {
    status: 'success';
    message: string;
    data: {
        isValid: boolean;
        certificate?: Certificate;
        reason?: string;
    };
}