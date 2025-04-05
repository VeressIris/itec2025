"use server";
import { prisma } from "@/utils";
import { put } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";

export async function addOrUpdateUser(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const imageFile = formData.get("profileImage") as File;
    let imageUrl = "";

    if (imageFile && imageFile.name) {
        try {
            const response = await put(imageFile.name, imageFile, {
                access: "public",
            });
            if (response?.url) {
                imageUrl = response.url;
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    }

    const formDataObject = Object.fromEntries(formData.entries());
    const { firstName, lastName, username, grade } = formDataObject;

    const user = await prisma.user.upsert({
        where: {
            id: userId,
        },
        update: {
            firstName: firstName as string,
            lastName: lastName as string,
            username: username as string,
            grade: grade as string,
            imageUrl,
        },
        create: {
            id: userId,
            firstName: firstName as string,
            lastName: lastName as string,
            username: username as string,
            grade: grade as string,
            imageUrl,
        },
    });

    return user;
}

export async function getCurrentUser() {
    const { userId } = await auth();
    if (!userId) return null;

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            firstName: true,
            lastName: true,
            username: true,
            grade: true,
            imageUrl: true,
        },
    });

    return user;
}
