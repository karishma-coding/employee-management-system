package com.ems.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.ems.dto.EmployeeResponseDTO;
import com.ems.dto.LoginEmployeeDTO;
import com.ems.exception.EmailNotFoundException;
import com.ems.exception.PasswordIncorrectException;
import com.ems.model.Employee;
import com.ems.repository.EmployeeRepository;

@Service
public class AuthService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public EmployeeResponseDTO login(@RequestBody LoginEmployeeDTO employee){
        Employee employeeDb = employeeRepository.findByEmail(employee.getEmail());
        if(employeeDb==null){
            throw new EmailNotFoundException("Email Id doesn't exists. Please register first.");
        }
        else{
            if (!passwordEncoder.matches(employee.getPassword(), employeeDb.getPassword())) {
                throw new PasswordIncorrectException("The password entered is incorrect. Please check once");
            }
        }
        EmployeeResponseDTO responseDTO = new EmployeeResponseDTO();
        responseDTO.setId(employeeDb.getId());
        responseDTO.setName(employeeDb.getName());
        responseDTO.setRole(employeeDb.getRole().name());
        responseDTO.setTitle(employeeDb.getTitle());
        responseDTO.setEmail(employeeDb.getEmail());
        return responseDTO;
    }
}