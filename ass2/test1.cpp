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

int main(){

	string buffer[2];
	name_age temp0;
	name_salary temp1;
	int current_block[2] = {};
	fstream block[12];
	ofstream output;

	output.open("./output1.csv");

	if(output.fail())
	{
		cout << "output file opening fail.\n";
	}

	/*********************************************************************************/

	// 두 릴레이션 모두 이름으로 정렬되어있기에 merge join을 구현하였다.
	// 둘 중 하나가 먼저 모든 블럭 탐색을 마쳤을 경우 조인을 멈추면 된다.
	// name은 key이기 때문에 중복되는 값이 없다는 것을 유의하며 구현하였다.
	
	current_block[0] = 0;
	current_block[1] = 0;

	block[0].open("name_age/" + to_string(current_block[0]) + ".csv");
	block[1].open("name_salary/" + to_string(current_block[1]) + ".csv");
	
	getline(block[0], buffer[0]);
	getline(block[1], buffer[1]);
	
	temp0.set_name_age(buffer[0]);
	temp1.set_name_salary(buffer[1]);

	while (true) {
		if (temp0.name >= temp1.name) {
			if (temp0.name == temp1.name) {
				output << make_tuple(temp0.name, temp0.age, temp1.salary);
			}

			if (!getline(block[1], buffer[1])) {
				block[1].close();
				current_block[1]++;
				if (current_block[1] == 1000) break;

				block[1].open("name_salary/" + to_string(current_block[1]) + ".csv");
				getline(block[1], buffer[1]);
			}

			temp1.set_name_salary(buffer[1]);
			
		} else if (temp0.name < temp1.name) {
			if (!getline(block[0], buffer[0])) {
				block[0].close();
				current_block[0]++;
				
				if (current_block[0] == 1000) break;

				block[0].open("name_age/" + to_string(current_block[0]) + ".csv");
				getline(block[0], buffer[0]);
			}

			temp0.set_name_age(buffer[0]);
		}
	}

	/*********************************************************************************/


	output.close();
}
