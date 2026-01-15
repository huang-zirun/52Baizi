interface DashboardLayoutProps {
    children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => (
    <div className="flex min-h-screen">
        {/* <ai_context>Sidebar will be added here</ai_context> */}
        <main className="flex-1">{children}</main>
    </div>
)

export default DashboardLayout
