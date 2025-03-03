import { Linkedin, Globe, GraduationCap, Mail } from "lucide-react";
import { Link } from "react-router-dom";

interface TeamMember {
    imageURL: string;
    name: string;
    role: string;
    links: {
        website?: string;
        linkedin?: string;
        google_scholar?: string;
        email?: string;
    };
}

export default function TeamSection({ teamMembers }: { teamMembers: TeamMember[] }) {
    return (
        <section className="py-12 bg-gradient-to-b from-background to-muted">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((teamMember, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col items-center bg-card rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-full border-4 border-primary/10">
                                <img
                                    src={teamMember.imageURL}
                                    alt={teamMember.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <h3 className="text-xl font-bold">{teamMember.name}</h3>
                            <p className="text-sm text-primary mb-2">{teamMember.role}</p>

                            <div className="flex items-center justify-center gap-3 mt-auto">
                                {teamMember.links.email && (
                                    <Link
                                        to="#"
                                        onClick={() => (window.location.href = `mailto:${teamMember.links.email}`)}
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        <Mail className="h-5 w-5" />
                                    </Link>
                                )}

                                {teamMember.links.website && (
                                    <Link to={teamMember.links.website} target="_blank" rel="noopener noreferrer">
                                        <Globe className="h-5 w-5" />
                                    </Link>
                                )}

                                {teamMember.links.linkedin && (
                                    <Link to={teamMember.links.linkedin} target="_blank" rel="noopener noreferrer">
                                        <Linkedin className="h-5 w-5" />
                                    </Link>
                                )}

                                {teamMember.links.google_scholar && (
                                    <Link
                                        to={teamMember.links.google_scholar}
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        <GraduationCap className="h-5 w-5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
