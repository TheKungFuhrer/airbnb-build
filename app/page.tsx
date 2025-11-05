import ClientOnly from "@/components/ClientOnly";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import MasonryGrid from "@/components/MasonryGrid";
import PostCard from "@/components/listing/PostCard";
import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";

// Force dynamic rendering (disable static generation)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface HomeProps {
  searchParams: IListingsParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const listing = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  if (listing.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <div className="pt-24 pb-10">
          <MasonryGrid
            columns={{
              default: 2,
              640: 2,
              768: 3,
              1024: 3,
              1280: 4,
              1536: 4,
            }}
            gap={4}
          >
            {listing.map((list, index) => {
              return (
                <PostCard
                  key={list.id}
                  data={list}
                  currentUser={currentUser}
                  index={index}
                />
              );
            })}
          </MasonryGrid>
        </div>
      </Container>
    </ClientOnly>
  );
}
