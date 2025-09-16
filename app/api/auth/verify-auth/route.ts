import { getAuthenticatedUserFromCookie } from "@/app/utils/auth";
import { AuthenticatedRequest } from "@/types/AuthenticatedRequest";
import { NextResponse } from "next/server";
import User from "@/app/models/user";


export async function GET(request: Request) {
try {
    const user=await getAuthenticatedUserFromCookie(request as AuthenticatedRequest);
    if(!user) return NextResponse.json({error:"Unauthorized"},{status:401});

      const data = await User.findById(user._id).select("-verificationCode -verificationToken -tokenExpiresAt -resetPasswordExpires -resetPasswordToken -verificationAttempts -isVerified -password");
    return NextResponse.json({success:true,data},{status:200});

} catch (error) {
    console.log(error);
    return NextResponse.json({success:false,message:"Une erreur s'est produite"},{status:500});
}

}



