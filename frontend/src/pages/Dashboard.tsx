import { useEffect, useState } from "react";

import api from "../api/client";

export default function Dashboard() {

  const [executions, setExecutions] =
    useState<any[]>([]);

  useEffect(() => {

    fetchExecutions();

  }, []);

  async function fetchExecutions() {

    const response =
      await api.get("/executions");

    setExecutions(
      response.data.data
    );
  }

  const totalTests =
    executions.length;

  const passedTests =
    executions.filter(
      (e) => e.status === "PASSED"
    ).length;

  const failedTests =
    executions.filter(
      (e) => e.status === "FAILED"
    ).length;

  const healedCount =
    executions.reduce(
      (sum, e) =>
        sum + e.healedCount,
      0
    );

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      <h1 className="text-4xl font-bold mb-8">
        AI QA Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-slate-900 rounded-2xl p-6">

          <h2 className="text-gray-400">
            Total Tests
          </h2>

          <p className="text-4xl font-bold mt-2">
            {totalTests}
          </p>

        </div>

        <div className="bg-green-900 rounded-2xl p-6">

          <h2 className="text-gray-200">
            Passed
          </h2>

          <p className="text-4xl font-bold mt-2">
            {passedTests}
          </p>

        </div>

        <div className="bg-red-900 rounded-2xl p-6">

          <h2 className="text-gray-200">
            Failed
          </h2>

          <p className="text-4xl font-bold mt-2">
            {failedTests}
          </p>

        </div>

        <div className="bg-cyan-900 rounded-2xl p-6">

          <h2 className="text-gray-200">
            AI Heals
          </h2>

          <p className="text-4xl font-bold mt-2">
            {healedCount}
          </p>

        </div>

      </div>

    </div>
  );
}