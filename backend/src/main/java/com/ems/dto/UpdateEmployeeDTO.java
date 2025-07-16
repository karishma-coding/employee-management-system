package com.ems.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdateEmployeeDTO {
    @NotBlank(message = "Name is required.")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Name must contain only alphabets and spaces.")
    private String name;

    @NotBlank(message = "Title is required.")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Title must contain only alphabets and spaces.")
    private String title;

    @NotBlank(message = "Role is required.")
    private String role;

    @NotBlank(message = "Email is required.")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,}$", message = "Email must be in a valid format.")
    private String email;
    

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }    

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
