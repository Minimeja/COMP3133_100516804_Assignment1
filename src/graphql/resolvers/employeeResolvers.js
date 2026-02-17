const Employee = require("../../models/Employee");

const employeeResolvers = {
  Query: {
    getAllEmployees: async () => {
      return Employee.find().sort({ created_at: -1 });
    },

    searchEmployeeById: async (_, { id }) => {
      const employee = await Employee.findById(id);
      if (!employee) throw new Error("Employee not found");
      return employee;
    },

    searchEmployeeByFilter: async (_, { designation, department }) => {
      if (!designation && !department) {
        throw new Error("Provide designation or department");
      }

      const filter = {};
      if (designation) filter.designation = designation;
      if (department) filter.department = department;

      return Employee.find(filter).sort({ created_at: -1 });
    }
  },

  Mutation: {
    addEmployee: async (_, args) => {
      if (args.salary < 1000) throw new Error("Salary must be >= 1000");

      const employee = await Employee.create({
        first_name: args.first_name,
        last_name: args.last_name,
        email: args.email,
        gender: args.gender,
        designation: args.designation,
        salary: args.salary,
        date_of_joining: args.date_of_joining,
        department: args.department,
        employee_photo: args.employee_photo
      });

      return employee;
    },

    updateEmployee: async (_, { id, ...updates }) => {
      if (updates.salary !== undefined && updates.salary < 1000) {
        throw new Error("Salary must be >= 1000");
      }

      const employee = await Employee.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
      });

      if (!employee) throw new Error("Employee not found");
      return employee;
    },

    deleteEmployee: async (_, { id }) => {
      const employee = await Employee.findByIdAndDelete(id);
      if (!employee) throw new Error("Employee not found");
      return "Employee deleted successfully";
    }
  }
};

module.exports = employeeResolvers;
