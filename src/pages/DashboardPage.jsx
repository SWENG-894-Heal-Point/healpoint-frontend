import {getMenuItems} from '@/utils/getMenuItems';
import Layout from "@/components/common/Layout.jsx";

export default function DashboardPage() {
    const menuItems = getMenuItems("patient");
    return (
        <>
            <Layout menuItems={menuItems}>
                <h2>Dashboard Page</h2>
            </Layout>
        </>
    );
};