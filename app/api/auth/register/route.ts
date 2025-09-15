
import sendEmail from "@/app/utils/sendEmail";
import User, { IUser } from "@/app/models/user";
import {NextResponse,NextRequest} from "next/server";
import { DBConnect } from "@/app/utils/bd";
import jwt from "jsonwebtoken";


interface IParticular {
  firstName:string;
  lastName: string;
  email: string;
  password: string;
}
interface IProfessional {
companyName:string;
siren:string;
tvaNumber:string;
annualRevenue:number;
email: string;
password: string;
}
interface IAdmin {
  email: string;
  password: string;
}

interface IActivationToken {
  code: string;
  token: string;
  tokenExpiresAt: Date;
}

export async function POST(req: NextRequest) {

   try{
    await DBConnect();

    const { email, password, firstName, lastName } = await req.json() as IParticular;

    if(!email || !password || !firstName || !lastName){
      return NextResponse.json({ success: false, message: "Veuillez remplir tous les champs." });
    }

  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    return NextResponse
      .json({ success: false, message: "Cette adresse mail existe déjà." },{
        status:400
      });
  }

  const newUser = new User({ email, password,firstName,lastName});
 
  const { code, token, tokenExpiresAt } = activateUser(newUser);

  newUser.verificationToken = token;
  newUser.verificationCode = code;
  newUser.tokenExpiresAt = tokenExpiresAt;

  

  await newUser.save();

  await sendEmail({
    data: {
      name: firstName,
      code,
      activationLink: token,
    },
    email,
    subject: "Activation de votre compte",
    template: "activationMail.ejs",
  });

  return NextResponse.json({
    success: true,
    data:newUser,
  },{
    status:201
  });

   }catch(err){
   console.error("Erreur lors de l'inscription :", err);
  return NextResponse.json(
    { success: false, message: "Erreur interne du serveur." },
    { status: 500 }
  );
   }

}   

const activateUser = (user: IUser): IActivationToken => {
  try {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign(
      { email: user.email },
      process.env.NEXT_PUBLIC_ACTIVATION_SECRET as string,
      {
        expiresIn: "10min",
      }
    );
    const tokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    return { code, token, tokenExpiresAt };
  } catch (error) {
    console.error(error);
    throw new Error("Échec de la génération du token d'activation.");
  }
};

