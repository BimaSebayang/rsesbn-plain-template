package com.bank.mega.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Users {

	@Id
	@Column(length=50)
	private String username;
	
	@Column(length=255, nullable=false)
	private String password;
	
	@Column(nullable=false)
	private Boolean enabled;
}
