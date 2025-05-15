// src/pages/Home.tsx
import React from "react";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import {
    FiCheckSquare,
    FiShoppingCart,
    FiUsers,
    FiBarChart2,
} from "react-icons/fi";

const Home: React.FC = () => {
    const nav = useNavigate();
    return (
        <main style={{ padding: "1rem" }}>
            <section className="hero">
                <h1>Welcome to MMS Dashboard</h1>
                <p>Your all-in-one maintenance management solution.</p>
                <button className="btn" onClick={() => nav("/about")}>
                    Learn More
                </button>
            </section>

            <section className="grid">
                <Card
                    icon={<FiCheckSquare />}
                    title="Tasks"
                    className="card-tasks"
                >
                    <p>View, assign, and track maintenance tasks in real time.</p>
                </Card>
                <Card
                    icon={<FiShoppingCart />}
                    title="Procurement"
                    className="card-procurement"
                >
                    <p>Manage purchase orders and supplier relationships effortlessly.</p>
                </Card>
                <Card
                    icon={<FiUsers />}
                    title="Attendance"
                    className="card-attendance"
                >
                    <p>Monitor team attendance and labor hours at a glance.</p>
                </Card>
                <Card
                    icon={<FiBarChart2 />}
                    title="Budget"
                    className="card-budget"
                >
                    <p>Keep budgets under control with clear spend analytics.</p>
                </Card>
            </section>
        </main>
    );
};

export default Home;
