import {getAuthenticatedUserFromCookie} from "@/app/utils/auth";
import { sendToken } from "@/app/utils/jwt";
import bcrypt from "bcryptjs";
import User,{ IUser } from "@/app/models/user";
import { NextResponse } from "next/server";

interface ILogin {
  email?: string;
  telephone?: string;
  password: string;
}

export async function POST(req: Request) {
//   const user = await getAuthenticatedUserFromCookie(req);

//   if (!user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

  try {

      const { email, password, telephone } = await req.json() as ILogin;

  if (!email || !password) {
    return NextResponse.json({
      success: false,
      message: "Veuillez saisir tous les champs requis.",
    },{status:400});
  }

  if (password && telephone) {
    return NextResponse.json({
      success: false,
      message: "Veuillez choisir un seul moyen de connexion.",
    },{status:400});
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse
      .json({ success: false, message: "Utilisateur introuvable" },{status:403});
  }

  if (!user.isVerified) {
    return NextResponse
      .json({ success: false, message: "Utilisateur non vérifié" },{status:401});
  }

  if (user.password && !telephone) {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse
        .json({ success: false, message: "Mot de passe incorrect" },{status:401});
    }
    const response=NextResponse.json({success:true,data:user});
    return await sendToken(user, 200,response);
  }

  if (user.phoneNumber && !password) {
    const isNumberCorrect = await User.findOne({ phoneNumber: { $eq: telephone } });

    if (!isNumberCorrect) {
      return NextResponse
        .json({ success: false, message: "Numero phone incorrect" },{status:401});
    }
    
    const response=NextResponse.json({success:true,data:user});
    return await sendToken(user, 200,response);
  }

    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Une erreur s'est produite" });
    
  }
    


}
