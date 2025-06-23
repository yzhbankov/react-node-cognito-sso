type LayoutProps = {
    renderNavbar: () => React.ReactNode,
    renderHeader: () => React.ReactNode,
    renderContent: () => React.ReactNode,
    renderFooter: () => React.ReactNode,
}

export function Layout({ renderContent, renderHeader, renderNavbar, renderFooter }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            {renderHeader()}
            <div className="flex flex-1">
                <div className="flex-shrink-0">
                    {renderNavbar()}
                </div>
                <div className="flex flex-col flex-1">
                    <main className="flex-1 bg-gray-50 text-black">
                        {renderContent()}
                    </main>
                    {renderFooter()}
                </div>
            </div>
        </div>
    );
}
