import { ProfileAliasActionEnum, SearchTypeEwalletAccountEnum } from "models"

export interface SearchEwalletAccountInput {
    filter?: {
        id?: number
        state?: string
        search?: string
        accountType?: string
        searchValue?: string
        searchType?: SearchTypeEwalletAccountEnum
        createdAt?: {
            from?: Date
            to?: Date
        }
        updatedAvatarAt?: {
            from?: Date
            to?: Date
        }
    }
    paging?: {
        start?: number
        limit?: number
    }
    sort?: {
        createdAt?: number
    }
}

export interface EwalletAccount {
    id?: number
    fullname?: string
    phone?: string
    email?: string
    avatar?: string
    updatedAvatarAt?: Date
    birthday?: Date
    isActive?: boolean
    isVerifiedEmail?: boolean
    state?: string
    gender?: string
    accountType?: string
    createdClientId?: string
    createdIp?: string
    scope?: string[]
    lastedLoginAt?: Date
    lastedLogoutAt?: Date
    address?: AddressEwalletAccountType
    createdDeviceInfo?: createdDeviceInfoType
    kyc?: KycEwalletType
    balance?: number
    appName?: string
    alias?: string
    clockLoginFail?: string
    createdAt?: Date
    updatedAt?: Date
    linkedInfo?: BankLinkedObject[]
    aliasProfile?: AlisaProfileObject
}
export interface AddressEwalletAccountType {
    street?: string
    city?: LocationEwalletType
    district?: LocationEwalletType
    ward?: LocationEwalletType
}
export interface LocationEwalletType {
    title?: string
    identifyCode?: string
    path?: string
}
export interface LocationEwalletType {
    title?: string
    identifyCode?: string
    path?: string
}
export interface LocationEwalletType {
    title?: string
    identifyCode?: string
    path?: string
}
export interface createdDeviceInfoType {
    platform?: string
    channel?: string
    version?: string
}

export interface KycEwalletType {
    kycId?: number
    type?: string
    identifyNumber?: string
    state?: string
    reason?: string
    sentAt?: Date
    image?: ImageEwalletKycType
    video?: VideoEwalletKycType
    face?: FaceEwalletKycType
    placeOfIssue?: string
    issuedAt?: Date
    address?: AddressEwalletAccountType
    kycMerchant?: KycMerchantEwalletType
}
export interface ImageEwalletKycType {
    front?: string
    back?: string
    state?: string
}
export interface VideoEwalletKycType {
    video?: string
    state?: string
}
export interface FaceEwalletKycType {
    face?: string
    state?: string
}
export interface KycMerchantEwalletType {
    taxCode?: string
    name?: string
    shortName?: string
    phone?: string
    email?: string
    website?: string
    logo?: string
    address?: string
    shopAddress?: string
    business?: string
    representative?: string
    state?: string
    lincenseImage?: string[]
}

export interface BankLinkedObject {
    id?: number
    accountId?: number
    phone?: string
    appName?: string
    state?: string
    linkedAt?: Date
    type?: string
    cardInfo?: CardInfoObject
}

export interface CardInfoObject {
    swiftCode?: string
    bankName?: string
    bankCode?: string
    cardNumber?: string
    accountNumber?: string
    cardHolder?: string
    issuedAt?: string
    expiredAt?: string
}
export interface AlisaProfileObject {
    id?: number
    alias?: string
    state?: string
    upDates?: number
    createdAt?: Date
}

export interface UpdateEwalletAccountInput {
    rejectAvatars: RejectAvatarInput[]
}

export interface RejectAvatarInput {
    accountId: number
    avatar: string
}

export interface ProfileAliasInput {
    action: ProfileAliasActionEnum
    profiledAliasId: number
    aliasName?: string
}

