#include <bits/stdc++.h>
using namespace std;

class name_age {
	public:
		string name;
		string age;
		
		void set_name_age(string tuple)
		{
			stringstream tuplestr(tuple);

			getline(tuplestr, name, ',');
			getline(tuplestr, age);
		}

        string to_str() {
            return name + ',' + age + '\n';
        }
};

class name_salary {
	public:
		string name;
		string salary;
		
		void set_name_salary(string tuple)
		{
			stringstream tuplestr(tuple);

			getline(tuplestr, name, ',');
			getline(tuplestr, salary);
		}

        string to_str() {
            return name + ',' + salary + '\n';
        }
};

string make_tuple(string name, string age, string salary)
{
	return name+ ',' + age + ',' + salary + '\n';
}

int main(){

	string buffer[2];
	name_age temp0;
	name_salary temp1;
	fstream block[12];
	ofstream output;

	output.open("./name_age1.csv");
    output << "name,age\n";
    for (int i = 0; i < 1000; ++i) {
        block[0].open("name_age/" + to_string(i) + ".csv");
        while (getline(block[0], buffer[0])) {
            temp0.set_name_age(buffer[0]);
            output << temp0.to_str();
        }
        block[0].close();
    }
	output.close();

    output.open("./name_salary1.csv");
    output << "name,salary\n";
    for (int i = 0; i < 1000; ++i) {
        block[0].open("name_salary/" + to_string(i) + ".csv");
        while (getline(block[0], buffer[0])) {
            temp1.set_name_salary(buffer[0]);
            output << temp1.to_str();
        }
        block[0].close();
    }

    output.close();
    
    return 0;	
}
