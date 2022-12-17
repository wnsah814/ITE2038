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
};

string make_tuple(string name, string age, string salary)
{
	return name+ ',' + age + ',' + salary + '\n';
}

int hash_string(string name) {
	int sum = 0;
	for (int i = 0; i < name.length(); ++i) {
		sum += int(name[i]);
	}
    return sum % 11;
}

int main(){

	string buffer[2];
	name_age temp0;
	name_salary temp1;
	fstream block[12];
	ofstream output;

	output.open("./output2.csv");

	if(output.fail())
	{
		cout << "output file opening fail.\n";
	}


	/******************************************************************/
	
	// let's say name_age r and name_salary s
	int i; // iterator

	// hasing start
	// age_salary(s)
	for (i = 0; i < 11; ++i) {
		block[i].open("./buckets/case2/bucket_s" + to_string(i) + ".csv", fstream::out | fstream::trunc);
		if (block[i].fail()) cout << "cannot open file\n";
	}

	for (i = 0; i < 1000; ++i) {
		block[11].open("./name_salary/" + to_string(i) + ".csv");
		while (getline(block[11], buffer[1])) {
			temp1.set_name_salary(buffer[1]);
			int res = hash_string(temp1.name);
			block[res] << temp1.name << ',' << temp1.salary << '\n';
		}
		block[11].close();
	}

	// name_age(r)
	for (i = 0; i < 11; ++i) {
		block[i].close();
		block[i].open("./buckets/case2/bucket_r" + to_string(i) + ".csv", fstream::out | fstream::trunc);
		if (block[i].fail()) cout << "cannot open file\n";
	}

	for (i = 0; i < 1000; ++i) {
		block[11].open("./name_age/" + to_string(i) + ".csv");
		while (getline(block[11], buffer[0])) {
			temp0.set_name_age(buffer[0]);
			int res = hash_string(temp0.name);
			block[res] << temp0.name << ',' << temp0.age << '\n';
		}
		block[11].close();
	}
	// hashing done

	// join start
	for (i = 0; i < 11; ++i) {
		block[i].close();
		block[i].open("./buckets/case2/bucket_r" + to_string(i) + ".csv");
	}

	for (i = 0; i < 11; ++i) {
		block[11].open("./buckets/case2/bucket_s" + to_string(i) + ".csv");	
		if (block[11].fail()) cout << "cannot open file\n";
		
		while (getline(block[i], buffer[0])) {
			temp0.set_name_age(buffer[0]);
			block[11].seekg(ios::beg);
			while (getline(block[11], buffer[1])) {
				temp1.set_name_salary(buffer[1]);
				if (temp0.name == temp1.name) {
					output << temp0.name << ',' << temp0.age << ',' << temp1.salary << '\n';
					break;
				}
			}
		}
		
		block[i].close();
		block[11].close();
	}

	/******************************************************************/

	output.close();

	
}
