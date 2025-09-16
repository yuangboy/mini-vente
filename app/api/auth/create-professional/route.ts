
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

    const { annualRevenue,companyName,email,password,siren,tvaNumber} = await req.json() as IProfessional;

    if(
      !annualRevenue ||
      !companyName ||
      !email ||
      !password ||
      !siren 
    ) {
      return NextResponse.json({ success: false, message: "Veuillez remplir tous les champs." });
    }

  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    return NextResponse
      .json({ success: false, message: "Cette adresse mail existe déjà." },{
        status:400
      });
  }
  const newUser = new User({annualRevenue,companyName,email,password,siren});

  if(tvaNumber){
    newUser.tvaNumber = tvaNumber;
  }
 
  newUser.role = "professional";
  newUser.isVerified = true;

  await newUser.save();

  await sendEmail({
    data: {
      name: companyName,
      code:"",
      activationLink: "",
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

