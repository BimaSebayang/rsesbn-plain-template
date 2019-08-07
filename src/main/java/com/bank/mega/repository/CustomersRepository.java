package com.bank.mega.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bank.mega.model.Customers;

@Repository
public interface CustomersRepository extends JpaRepository<Customers, Long> {

}
