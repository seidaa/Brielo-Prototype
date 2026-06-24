import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import SplashGate from "@/components/splash";

import Landing from "@/pages/landing";
import Onboarding from "@/pages/onboarding";
import Interests from "@/pages/interests";
import Discover from "@/pages/discover";
import CreateMove from "@/pages/create";
import MoveDetail from "@/pages/rally-detail";
import PostMove from "@/pages/post-move";
import ChatList from "@/pages/chat";
import ChatDetail from "@/pages/chat-detail";
import Friends from "@/pages/friends";
import Circles from "@/pages/circles";
import CircleDetail from "@/pages/circle-detail";
import Profile from "@/pages/profile";
import Map from "@/pages/map";
import Reset from "@/pages/reset";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/"              component={Landing}     />
      <Route path="/welcome"       component={Onboarding}  />
      <Route path="/interests"     component={Interests}   />
      <Route path="/discover"      component={Discover}    />
      <Route path="/create"        component={CreateMove}  />
      <Route path="/rally/:id"     component={MoveDetail}  />
      <Route path="/post-move/:id" component={PostMove}    />
      <Route path="/chat"          component={ChatList}    />
      <Route path="/chat/:id"      component={ChatDetail}  />
      <Route path="/friends"       component={Friends}     />
      <Route path="/circles"       component={Circles}     />
      <Route path="/circles/:id"   component={CircleDetail}/>
      <Route path="/profile"       component={Profile}     />
      <Route path="/map"           component={Map}         />
      <Route path="/reset"         component={Reset}       />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="max-w-sm mx-auto min-h-screen overflow-hidden relative bg-[#0d0d0d] shadow-2xl">
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <SplashGate />
            <Router />
          </WouterRouter>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
