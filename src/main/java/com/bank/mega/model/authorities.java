package com.bank.mega.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

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
public class authorities {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long authoritiesId;
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name="username",nullable=false, referencedColumnName="username")
	public Users username;
	
	@Column(nullable=false)
	public String authority;
}
