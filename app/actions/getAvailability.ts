import prisma from "@/lib/prismadb";

interface IParams {
  listingId: string;
}

export default async function getAvailability(params: IParams) {
  try {
    const { listingId } = params;

    if (!listingId) {
      return [];
    }

    const availability = await prisma.availability.findMany({
      where: {
        listingId,
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    const safeAvailability = availability.map((avail) => ({
      ...avail,
      createdAt: avail.createdAt.toISOString(),
      blockDate: avail.blockDate?.toISOString() || null,
    }));

    return safeAvailability;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
