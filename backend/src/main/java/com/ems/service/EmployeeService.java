package com.ems.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import com.ems.dto.CreateEmployeeDTO;
import com.ems.dto.UpdateEmployeeDTO;
import com.ems.model.Employee;
import com.ems.repository.EmployeeRepository;

@Validated
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

    public Employee saveEmployee(CreateEmployeeDTO employeeDto){
        Employee employee = new Employee();
        employee.setName(employeeDto.getName());
        employee.setTitle(employeeDto.getTitle());
        employee.setEmail(employeeDto.getEmail());
        String hashPassword = passwordEncoder.encode(employeeDto.getPassword());
        employee.setPassword(hashPassword);
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(long id, UpdateEmployeeDTO newEmployee){
        return employeeRepository.findById(id)
            .map(emp -> {
                emp.setName(newEmployee.getName());
                emp.setEmail(newEmployee.getEmail());
                emp.setTitle(newEmployee.getTitle());
                return employeeRepository.save(emp);
            }).orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public void deleteEmployee(Long id) {
      employeeRepository.deleteById(id);
   }
}
