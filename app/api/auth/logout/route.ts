import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = NextResponse.json(
      { success: true, message: "Déconnexion effectuée" },
      { status: 200 }
    );

    // Supprimer les cookies en les réécrivant avec une date expirée
    response.cookies.set("accessToken", "", {
      expires: new Date(0),
      httpOnly: true,
      path: "/",
    });

    response.cookies.set("refreshToken", "", {
      expires: new Date(0),
      httpOnly: true,
      path: "/",
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Une erreur s'est produite" },
      { status: 500 }
    );
  }
}
