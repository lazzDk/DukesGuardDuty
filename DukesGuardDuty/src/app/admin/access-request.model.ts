export interface AccessRequest {
    id?: string;    
    userId: string;
    displayName: string;
    isApproved: boolean;
    approvedById?:string;
}