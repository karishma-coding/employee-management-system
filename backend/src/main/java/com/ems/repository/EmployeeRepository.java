package com.ems.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ems.model.Employee;
import java.util.List;


public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Employee findByEmail(String email);

    @Query("SELECT e FROM Employee e WHERE " +
       "CAST(e.id AS string) LIKE %:keyword% OR " +
       "LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
       "LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
       "LOWER(e.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Employee> searchByKeyword(@Param("keyword") String keyword);
}
