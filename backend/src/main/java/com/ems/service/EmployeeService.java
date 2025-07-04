package com.ems.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ems.model.Employee;
import com.ems.repository.EmployeeRepository;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Employee> getAllEmployees(){
        return employeeRepository.findAll();
    }

    public Optional<Employee> getEmployeeById(long id){
        return employeeRepository.findById(id);
    }

    public Employee saveEmployee(Employee employee){
        String hashPassword = passwordEncoder.encode(employee.getPassword());
        employee.setPassword(hashPassword);
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(long id, Employee newEmployee){
        return employeeRepository.findById(id)
            .map(emp -> {
                emp.setName(newEmployee.getName());
                emp.setEmail(newEmployee.getEmail());
                emp.setPassword(newEmployee.getPassword());
                emp.setTitle(newEmployee.getTitle());
                return employeeRepository.save(emp);
            }).orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public void deleteEmployee(Long id) {
      employeeRepository.deleteById(id);
   }
}
