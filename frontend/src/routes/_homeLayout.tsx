import { HomeHeader } from "@/features/shared/components/homeHeader";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { chatButton } from "@/features/shared/components/chatButton";


export const Route = createFileRoute("/_homeLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-144px)] mt-12 md:mt-16">
      <HomeHeader />
      <Outlet />
      {chatButton()}
    </div>
  );
}
