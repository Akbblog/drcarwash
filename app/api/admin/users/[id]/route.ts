import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        // params is a Promise in newer Next.js versions
        const { id } = await params;
        const data = await req.json();

        // Exclude _id if present in data
        delete data._id;
        delete data.id;

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        console.error("Update user error:", error);
        return NextResponse.json({ message: error.message || "Error updating user" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error: any) {
        console.error("Delete user error:", error);
        return NextResponse.json({ message: error.message || "Error deleting user" }, { status: 500 });
    }
}
