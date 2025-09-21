import React from "react";
import { Outlet, Link, useNavigate } from "react-router";
import { Layout, Menu, Avatar, Dropdown, Space, Button, theme } from "antd";
import {
  UserOutlined,
  PlusCircleOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2"; 
import Logo from "../Components/Logo";
import useAuth from "../Hooks/useAuth";

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      Swal.fire({
        title: "Logged Out",
        text: "You have been logged out successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/"); 
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Logout failed. Try again!",
        icon: "error",
      });
      console.error("Logout failed:", error);
    }
  };

  const items = [
    { key: "profile", icon: <UserOutlined />, label: <Link to="profile">My Profile</Link> },
    { key: "add-post", icon: <PlusCircleOutlined />, label: <Link to="add-post">Add Post</Link> },
    { key: "my-post", icon: <FileTextOutlined />, label: <Link to="my-post">My Posts</Link> },
    { key: "membership", icon: <CreditCardOutlined />, label: <Link to="membership">Membership</Link> },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: (
        <Button
          type="text"
          onClick={handleLogout} 
          style={{ padding: 0, color: "white", fontWeight: "bold" }}
        >
          Logout
        </Button>
      ),
    },
  ];

  const userMenu = (
    <Menu
      items={[
        { key: "email", label: <span>{user?.email}</span>, disabled: true },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider width={240} style={{ background: "#001529" }}>
        <div className="flex items-center  p-4">
          <Logo />
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["profile"]} items={items} style={{ marginTop: 20 }} />
      </Sider>

      {/* Main Layout */}
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: "linear-gradient(90deg, #4f46e5, #3b82f6)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            minHeight: 100,
          }}
        >
          <div className="flex justify-center items-center">
            <h2 style={{ margin: 0, fontWeight: "bold", fontSize: 26 }}>
              <span className="text-2xl mr-1">📊</span>Dashboard
            </h2>
          </div>

          {/* Right: User Avatar */}
          {user && (
            <Dropdown overlay={userMenu} placement="bottomRight" arrow>
              <Space style={{ cursor: "pointer" }}>
                <Avatar
                  src={user.photoURL || undefined}
                  icon={!user.photoURL && <UserOutlined />}
                  size="large"
                />
                <span style={{ color: "white", fontWeight: 500 }}>
                  {user.email}
                </span>
              </Space>
            </Dropdown>
          )}
        </Header>

        <Content style={{ margin: "24px 16px", overflow: "initial" }}>
          <div
            style={{
              padding: 24,
              minHeight: "80vh",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
