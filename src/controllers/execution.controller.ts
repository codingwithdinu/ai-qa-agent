import { Request, Response } from "express";

import ExecutionService
  from "../services/execution/execution.service";

/**
 * Get all executions
 */
export async function getAllExecutions(
  _req: Request,
  res: Response
) {

  try {

    const executions =
      await ExecutionService.getAllExecutions();

    return res.status(200).json({

      success: true,

      data: executions,

    });

  } catch (error: any) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

}

/**
 * Get execution by ID
 */
export async function getExecutionById(
  req: Request,
  res: Response
) {

  try {

    const { id } = req.params;

    const execution =
      await ExecutionService.getExecutionById(id);

    if (!execution) {

      return res.status(404).json({

        success: false,

        message: "Execution not found",

      });

    }

    return res.status(200).json({

      success: true,

      data: execution,

    });

  } catch (error: any) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

}

/**
 * Get failed executions
 */
export async function getFailedExecutions(
  _req: Request,
  res: Response
) {

  try {

    const failedExecutions =
      await ExecutionService.getFailedExecutions();

    return res.status(200).json({

      success: true,

      data: failedExecutions,

    });

  } catch (error: any) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

}

/**
 * Get execution statistics
 */
export async function getExecutionStats(
  _req: Request,
  res: Response
) {

  try {

    const stats =
      await ExecutionService.getExecutionStats();

    return res.status(200).json({

      success: true,

      data: stats,

    });

  } catch (error: any) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

}

export default {

  getAllExecutions,
  getExecutionById,
  getFailedExecutions,
  getExecutionStats,

};