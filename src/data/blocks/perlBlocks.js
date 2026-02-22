export const PERL_BLOCKS = [
  `sub calculate_average {

    my @numbers = @_;
    return 0 unless @numbers;
    my $sum = 0;
    $sum += $_ for @numbers;
    return $sum / @numbers;
}`,

  `package BankAccount;

sub new {
    my ($class, $balance) = @_;
    $balance //= 0;
    my $self = {
        balance => $balance
    };
    bless $self, $class;
    return $self;
}

sub deposit {
    my ($self, $amount) = @_;
    if ($amount > 0) {
        $self->{balance} += $amount;
        return 1;
    }
    return 0;
}

sub withdraw {
    my ($self, $amount) = @_;
    if ($amount <= $self->{balance}) {
        $self->{balance} -= $amount;
        return 1;
    }
    return 0;
}`,

  `use strict;

use warnings;
use Data::Dumper;

my %config = (
    host => 'localhost',
    port => 3306,
    database => 'mydb',
    user => 'admin'
);

print Dumper(\%config);`,

  `my @numbers = (1, 2, 3, 4, 5);

my @squared = map { $_ * $_ } @numbers;
my @evens = grep { $_ % 2 == 0 } @numbers;
my $sum = 0;
$sum += $_ for @numbers;`,

  `open my $fh, '<', 'data.txt' or die "Cannot open file: $!";

while (my $line = <$fh>) {
    chomp $line;
    next if $line =~ /^#/;
    my @fields = split /\t/, $line;
    process_fields(@fields);
}
close $fh;`,

  `use DBI;

my $dbh = DBI->connect(
    "DBI:mysql:database=mydb;host=localhost",
    "username",
    "password",
    { RaiseError => 1, AutoCommit => 0 }
) or die $DBI::errstr;

my $sth = $dbh->prepare("SELECT * FROM users WHERE age > ?");
$sth->execute(18);

while (my $row = $sth->fetchrow_hashref) {
    print "$row->{name}\n";
}

$dbh->disconnect();`,

  `sub fibonacci {

    my ($n) = @_;
    return $n if $n <= 1;
    return fibonacci($n - 1) + fibonacci($n - 2);
}

my @fib_sequence = map { fibonacci($_) } (0..10);`,

  `my $text = "Hello, World!";

$text =~ s/World/Perl/g;
$text =~ tr/a-z/A-Z/;

if ($text =~ /PERL/) {
    print "Match found\n";
}`,

  `use JSON;

use LWP::UserAgent;

my $ua = LWP::UserAgent->new;
my $response = $ua->get('https://api.example.com/data');

if ($response->is_success) {
    my $data = decode_json($response->decoded_content);
    foreach my $item (@{$data->{items}}) {
        print "$item->{name}\n";
    }
}`,

  `package Logger;

use Moose;

has 'filename' => (is => 'ro', isa => 'Str', required => 1);
has 'level' => (is => 'rw', isa => 'Str', default => 'INFO');

sub log_message {
    my ($self, $message) = @_;
    open my $fh, '>>', $self->filename;
    print $fh "[$self->{level}] $message\n";
    close $fh;
}

__PACKAGE__->meta->make_immutable;`,

  `my @people = (

    { name => 'Alice', age => 30 },
    { name => 'Bob', age => 25 },
    { name => 'Charlie', age => 35 }
);

my @sorted = sort { $a->{age} <=> $b->{age} } @people;
my @adults = grep { $_->{age} >= 18 } @people;`,

  `sub process_data {

    my ($data, $callback) = @_;
    
    foreach my $item (@$data) {
        next unless defined $item;
        $callback->($item) if ref($callback) eq 'CODE';
    }
}

process_data(\@array, sub {
    my $item = shift;
    print "Processing: $item\n";
});`,

  `use Try::Tiny;

try {
    my $result = risky_operation();
    process_result($result);
}
catch {
    warn "Error occurred: $_";
    log_error($_);
}
finally {
    cleanup_resources();
};`,

  `my %hash = (

    apple => 1,
    banana => 2,
    cherry => 3
);

foreach my $key (keys %hash) {
    print "$key => $hash{$key}\n";
}

exists $hash{apple} && delete $hash{apple};`,

  `package EmailValidator;

sub validate {
    my ($self, $email) = @_;
    
    return 0 unless defined $email;
    
    my $pattern = qr/^[\w\.-]+@[\w\.-]+\.\w+$/;
    return $email =~ $pattern ? 1 : 0;
}`,

  `use File::Find;

sub process_file {
    return unless -f $_;
    return unless /\.pl$/;
    print "Found: $File::Find::name\n";
}

find(\&process_file, '/path/to/search');`,

  `my $config = {

    database => {
        host => 'localhost',
        port => 3306,
        name => 'mydb'
    },
    cache => {
        enabled => 1,
        ttl => 300
    }
};

my $db_host = $config->{database}->{host};`,

  `sub memoize {

    my $func = shift;
    my %cache;
    
    return sub {
        my $key = join(',', @_);
        return $cache{$key} if exists $cache{$key};
        $cache{$key} = $func->(@_);
        return $cache{$key};
    };
}`,

  `use DateTime;

my $now = DateTime->now;
my $formatted = $now->strftime('%Y-%m-%d %H:%M:%S');

my $tomorrow = $now->add(days => 1);
my $diff = $tomorrow->subtract_datetime($now);`,

  `package Counter;

{
    my $count = 0;
    
    sub increment {
        return ++$count;
    }
    
    sub decrement {
        return --$count;
    }
    
    sub get_count {
        return $count;
    }
}`,

  `my @array = qw(one two three four five);

my $first = shift @array;
my $last = pop @array;
push @array, 'six';
unshift @array, 'zero';

my $joined = join('-', @array);`,

  `sub curry {

    my ($func, @args1) = @_;
    
    return sub {
        my @args2 = @_;
        return $func->(@args1, @args2);
    };
}

my $add = sub { $_[0] + $_[1] };
my $add5 = curry($add, 5);
my $result = $add5->(10);`,

  `use Parallel::ForkManager;

my $pm = Parallel::ForkManager->new(5);

foreach my $item (@items) {
    $pm->start and next;
    
    process_item($item);
    
    $pm->finish;
}

$pm->wait_all_children;`,

  `package WebScraper;

use Web::Scraper;
use URI;

my $scraper = scraper {
    process 'h1', 'title' => 'TEXT';
    process 'a', 'links[]' => '@href';
};

my $result = $scraper->scrape(URI->new($url));`,

  `use Digest::SHA qw(sha256_hex);

my $password = 'secret123';
my $hash = sha256_hex($password);

my $salt = generate_salt();
my $salted_hash = sha256_hex($salt . $password);`,

  `my $scalar = 42;

my @array = (1, 2, 3);
my %hash = (key => 'value');
my $array_ref = \@array;
my $hash_ref = \%hash;

print ref($array_ref);`,

  `sub validate_input {

    my %params = @_;
    
    die "Name required" unless $params{name};
    die "Age must be numeric" unless $params{age} =~ /^\d+$/;
    die "Email invalid" unless $params{email} =~ /\@/;
    
    return 1;
}`,

  `use List::Util qw(sum max min);

my @numbers = (5, 2, 8, 1, 9);

my $total = sum @numbers;
my $maximum = max @numbers;
my $minimum = min @numbers;`,

  `package Template::Engine;

sub render {
    my ($self, $template, $vars) = @_;
    
    my $output = $template;
    foreach my $key (keys %$vars) {
        my $value = $vars->{$key};
        $output =~ s/\{\{$key\}\}/$value/g;
    }
    return $output;
}`,

  `use Carp qw(croak cluck);

sub divide {
    my ($a, $b) = @_;
    croak "Division by zero" if $b == 0;
    return $a / $b;
}`,

  `my $string = "  Hello World  ";

$string =~ s/^\s+//;
$string =~ s/\s+$//;
$string = lc($string);
$string = uc($string);
$string = ucfirst($string);`
]
