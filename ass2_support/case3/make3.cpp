#include <bits/stdc++.h>
using namespace std;

class name_grade {
	public:
		string student_name;
		int korean;
		int math;
		int english;
		int science;
		int social;
		int history;

		void set_grade(string tuple)
		{
			stringstream tuplestr(tuple);
			string tempstr;

			getline(tuplestr, student_name, ',');

			getline(tuplestr, tempstr, ',');
			korean = stoi(tempstr);
			
			getline(tuplestr, tempstr, ',');
			math = stoi(tempstr);
			
			getline(tuplestr, tempstr, ',');
			english = stoi(tempstr);
			
			getline(tuplestr, tempstr, ',');
			science = stoi(tempstr);
			
			getline(tuplestr, tempstr, ',');
			social = stoi(tempstr);
			
			getline(tuplestr, tempstr);
			history = stoi(tempstr);
		}
        string to_str() {
            return student_name + ',' + to_string(korean) + ',' + to_string(math) + ',' + to_string(english) + ',' + to_string(science) + ',' + to_string(social) + ',' + to_string(history) + '\n';
        }
};

class name_number{
	public :
		string student_name;
		string student_number;

		void set_number(string tuple)
		{
			stringstream tuplestr(tuple);
			string tempstr;


			getline(tuplestr, student_name, ',');
			getline(tuplestr, student_number, ',');
		}

        string to_str() {
            return student_name + ',' + student_number + '\n';
        }
};

string make_tuple(string name, string number)
{
	string ret = "";

	ret += name+ "," + number +"\n";

	return ret;
}

int main(){

	string buffer[2];
	name_grade temp0;
	name_grade temp1;
	name_number temp2;
	fstream block[12];
	ofstream output;

	output.open("./name_grade1.csv");
    
    output << "student_name,korean,math,english,science,social,history\n";
    for (int i = 0; i < 1000; ++i) {
        block[0].open("name_grade1/" + to_string(i) + ".csv");
        while (getline(block[0], buffer[0])) {
            temp0.set_grade(buffer[0]);
            output << temp0.to_str();
        }
        block[0].close();
    }
	output.close();

	output.open("./name_grade2.csv");
    
    output << "student_name,korean,math,english,science,social,history\n";
    for (int i = 0; i < 1000; ++i) {
        block[0].open("name_grade2/" + to_string(i) + ".csv");
        while (getline(block[0], buffer[0])) {
            temp1.set_grade(buffer[0]);
            output << temp1.to_str();
        }
        block[0].close();
    }
	output.close();
	
	output.open("./name_number.csv");
    
    output << "student_name,student_number\n";
    for (int i = 0; i < 1000; ++i) {
        block[0].open("name_number/" + to_string(i) + ".csv");
        while (getline(block[0], buffer[0])) {
            temp2.set_number(buffer[0]);
            output << temp2.to_str();
        }
        block[0].close();
    }
	output.close();
}
