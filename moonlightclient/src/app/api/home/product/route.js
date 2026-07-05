import { NextResponse } from "next/server";

const Tempdata = [
    {
        name: "FULL AUTOMATIC SINGLE DIE PAPER PLATE MAKING MACHINE",
        slug: "full-automatic-single-die-paper",
        sku: "SR-0142",
        price: 35000.0,
        stock: 86,
        category: "Automatic",
        image: "/p-d.png",
        tag: "In stock",
        description:
            "Pre-seasoned, single-pour cast iron. Goes from stovetop to oven to table without changing pans. Gets better with use, not worse.",
        images: ["/p-a.png", "/p-b.png", "/p-c.png", "/p-d.png"],
        specs: [
            { label: "Material", value: "Cast iron, pre-seasoned" },
            { label: "Diameter", value: "10 in / 25.4 cm" },
            { label: "Weight", value: "3.2 kg" },
            { label: "Oven safe", value: "Up to 500°F / 260°C" },
            { label: "Origin", value: "Made in Ohio, USA" },
            { label: "Care", value: "Hand wash, dry, oil lightly" },
        ],
    },
    {
        name: "Fully Automatic Paper Cup Machine",
        slug: "fully-automatic-paper-cum-machine",
        price: 60000.0,
        category: "Automatic",
        image: "/p-a.png",
    },
    {
        name: "FULL AUTOMATIC DOUBLE DIE PAPER PLATE MAKING MACHINE",
        slug: "fully-automatic-double-die-paper-plate-making-machine",
        price: 73000.0,
        category: "Automatic",
        image: "/doubledie.png",
    },
    {
        name: "HYDRAULIC SINGLE CYLINDER WITH PANEL BOARD PAPER PLATE MAKING MACHINE",
        price: 70000.0,
        category: "Manually",
        image: "/HYDRAULICSINGLECYLINDER.png",
        tag: "Low stock",
    },
    {
        name: "HYDRAULIC DOUBLE CYLINDER WITH PANEL PAPER PLATE MAKING MACHINE",
        price: 50000.0,
        category: "Manually",
        image: "/HYDRAULICDOUBLECYLINDER.png",
        tag: "In stock",
    },
    {
        name: "ALL IN ONE PAPER PLATE MAKING MACHINE",
        price: 95000.0,
        category: "Automatic",
        image: "/ALLINONEPAPERPLATEMAKINGMACHINE.png",
    },
    {
        name: "LAMINATION WITH ONLINE SLITTING.png",
        price: 400000.0,
        category: "Automatic",
        image: "/LAMINATION WITH ONLINE SLITTING.png",
    },
];

export async function GET(req) {

    return NextResponse.json({ message: "Product get successfull", item: Tempdata })
}

export async function POST (req){
    const {body} = req.body
    console.log(body)
    return NextResponse.json({ message: "Product get successfull", item: Tempdata[0] })
}

