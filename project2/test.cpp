#include <iostream>
using namespace std;

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <stdint.h>
#include <sys/types.h>
#include <fcntl.h>
#include <unistd.h>
#include <inttypes.h>
#include <string.h>
#define LEAF_MAX 31
#define INTERNAL_MAX 248

typedef struct Header_Page{
    off_t fpo; // free page offset: position of the first free page
    off_t rpo; // root page offset 
    int64_t num_of_pages;
    char reserved[4072];
} H_P;


int main() {
    H_P* hp = (H_P*)calloc(1, sizeof(H_P));
    cout << hp -> fpo << ' ' << hp->rpo << ' ' << hp -> num_of_pages << ' ' << hp->reserved << '\n';
    return 0;
}