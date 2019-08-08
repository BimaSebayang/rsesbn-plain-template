package com.bank.mega.bean;

import com.google.gson.Gson;

public class UserBean {
          private String userName;
          private String password;
          private String noEktp;
		public String getUserName() {
			return userName;
		}
		public void setUserName(String userName) {
			this.userName = userName;
		}
		public String getPassword() {
			return password;
		}
		public void setPassword(String password) {
			this.password = password;
		}
		public String getNoEktp() {
			return noEktp;
		}
		public void setNoEktp(String noEktp) {
			this.noEktp = noEktp;
		}
		
		
//		public String toString(UserBean user) {
//			// TODO Auto-generated method stub
//			return new Gson().toJson(user);
//		}
          
         
}
