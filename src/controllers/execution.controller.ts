import { Request, Response } from "express";
import ExecutionService
  from "../services/execution/execution.service";
import { AuthRequest } from "../middleware/auth.middleware";



/**
 * Get all executions
 */
export async function getAllExecutions(
  req: AuthRequest,
  res: Response
) {

  try {

    const executions =
      await ExecutionService.getAllExecutions(
        req.userId!
      );

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
  req: AuthRequest,
  res: Response
) {

  try {

    const { id } = req.params;

    const execution =
      await ExecutionService.getExecutionById(
        id,
        req.userId!
      );

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
  req: AuthRequest,
  res: Response
) {

  try {

    const failedExecutions =
      await ExecutionService.getFailedExecutions(
        req.userId!
      );
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
  req: AuthRequest,
  res: Response
) {

  try {

    const stats =
      await ExecutionService.getExecutionStats(
        req.userId!
      );
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