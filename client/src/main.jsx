import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { AppLayout } from "./components/AppLayout.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { AgentDashboard } from "./pages/AgentDashboard.jsx";
import { AnalyticsPage } from "./pages/AnalyticsPage.jsx";
import { ChatPage } from "./pages/ChatPage.jsx";
import { DemoCompanyPage } from "./pages/DemoCompanyPage.jsx";
import { KnowledgeBasePage } from "./pages/KnowledgeBasePage.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { MyTicketsPage } from "./pages/MyTicketsPage.jsx";
import { NewTicketPage } from "./pages/NewTicketPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { TicketDetailPage } from "./pages/TicketDetailPage.jsx";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<DemoCompanyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/app/chat" element={<ChatPage />} />
            <Route path="/app/new-ticket" element={<NewTicketPage />} />
            <Route path="/app/tickets" element={<MyTicketsPage />} />
            <Route path="/app/tickets/:id" element={<TicketDetailPage />} />
            <Route
              path="/app/agent"
              element={
                <ProtectedRoute roles={["agent", "admin"]}>
                  <AgentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/admin/analytics"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/admin/kb"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <KnowledgeBasePage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
