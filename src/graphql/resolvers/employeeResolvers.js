const Employee = require("../../models/Employee");
const uploadImage = require("../../utils/uploadImage");

const employeeResolvers = {
  Query: {
    getAllEmployees: async () => {
      return Employee.find().sort({ created_at: -1 });
    },

    searchEmployeeById: async (_, { id }) => {
      if (!id) throw new Error("Employee id is required");

      const employee = await Employee.findById(id);
      if (!employee) throw new Error("Employee not found");

      return employee;
    },

    searchEmployeeByFilter: async (_, { designation, department }) => {
      const hasDesignation = typeof designation === "string" && designation.trim() !== "";
      const hasDepartment = typeof department === "string" && department.trim() !== "";

      if (!hasDesignation && !hasDepartment) {
        throw new Error("Provide designation or department");
      }

      const filter = {};
      if (hasDesignation) filter.designation = designation.trim();
      if (hasDepartment) filter.department = department.trim();

      return Employee.find(filter).sort({ created_at: -1 });
    }
  },

  Mutation: {
    addEmployee: async (_, args) => {
      if (!args.first_name || !args.last_name) throw new Error("First name and last name are required");
      if (!args.designation) throw new Error("Designation is required");
      if (args.salary === undefined || args.salary === null) throw new Error("Salary is required");
      if (!args.date_of_joining) throw new Error("Date of joining is required");
      if (!args.department) throw new Error("Department is required");

      if (Number(args.salary) < 1000) throw new Error("Salary must be >= 1000");

      // ✅ Upload to Cloudinary (if provided)
      let photoUrl = null;
      if (args.employee_photo) {
        photoUrl = await uploadImage(args.employee_photo);
      }

      const employee = await Employee.create({
        first_name: args.first_name,
        last_name: args.last_name,
        email: args.email,
        gender: args.gender,
        designation: args.designation,
        salary: Number(args.salary),
        date_of_joining: args.date_of_joining,
        department: args.department,
        employee_photo: photoUrl
      });

      return employee;
    },

    updateEmployee: async (_, { id, ...updates }) => {
      if (!id) throw new Error("Employee id is required");

      Object.keys(updates).forEach((key) => {
        if (updates[key] === undefined) delete updates[key];
      });

      if (updates.salary !== undefined && updates.salary !== null) {
        if (Number(updates.salary) < 1000) throw new Error("Salary must be >= 1000");
        updates.salary = Number(updates.salary);
      }

      // ✅ Upload new photo if provided
      if (updates.employee_photo) {
        updates.employee_photo = await uploadImage(updates.employee_photo);
      }

      const employee = await Employee.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
      });

      if (!employee) throw new Error("Employee not found");
      return employee;
    },

    deleteEmployee: async (_, { id }) => {
      if (!id) throw new Error("Employee id is required");

      const employee = await Employee.findByIdAndDelete(id);
      if (!employee) throw new Error("Employee not found");

      return "Employee deleted successfully";
    }
  }
};

module.exports = employeeResolvers;