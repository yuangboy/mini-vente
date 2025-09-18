  export interface IUser{  
  _id?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  siren?: string;
  tvaNumber?: string;
  annualRevenue?: number;
  email: string;
  password: string;
  profilePicture?: string;
  phoneNumber?: string;
  isVerified?: boolean;
  role: string;
  verificationCode?: string | null;
  verificationToken?: string | null;
  tokenExpiresAt?: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  verificationAttempts: number;
    comparePassword?: (password: string) => Promise<boolean>;
    signAccessToken?: () => string;
    signRefreshToken?: () => string;
    }

    
export interface IRegister{  
    lastName:string;
    firstName:string;
    email:string;
    password:string;
    }

export interface IResponseRegister{
    success: boolean;
    newUser: IUser;
}    

export interface productDetails{
    _id?:string;
    title:string;
    description?:string;
    price:number;
    image:string[];
    category:string;
    seller:IUser;
    typeClient: "particular" | "professional";
    productType: "high-end-phone" | "mid-range-phone" | "laptop";
    displayPrice?:string;
    priceLabel?:string;
    createdAt?:string;
}