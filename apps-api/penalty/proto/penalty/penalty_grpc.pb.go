// protocol buffers version 3

// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.5.1
// - protoc             v5.28.2
// source: penalty.proto

// define package name or namespace

package penalty

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.64.0 or later.
const _ = grpc.SupportPackageIsVersion9

const (
	PenaltyGapi_InsertPenalty_FullMethodName   = "/penalty.PenaltyGapi/InsertPenalty"
	PenaltyGapi_IsUserPenalized_FullMethodName = "/penalty.PenaltyGapi/isUserPenalized"
)

// PenaltyGapiClient is the client API for PenaltyGapi service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type PenaltyGapiClient interface {
	InsertPenalty(ctx context.Context, in *InsertPenaltyRequest, opts ...grpc.CallOption) (*InsertPenaltyResponse, error)
	IsUserPenalized(ctx context.Context, in *IsUserPenalizedRequest, opts ...grpc.CallOption) (*IsUserPenalizedResponse, error)
}

type penaltyGapiClient struct {
	cc grpc.ClientConnInterface
}

func NewPenaltyGapiClient(cc grpc.ClientConnInterface) PenaltyGapiClient {
	return &penaltyGapiClient{cc}
}

func (c *penaltyGapiClient) InsertPenalty(ctx context.Context, in *InsertPenaltyRequest, opts ...grpc.CallOption) (*InsertPenaltyResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(InsertPenaltyResponse)
	err := c.cc.Invoke(ctx, PenaltyGapi_InsertPenalty_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *penaltyGapiClient) IsUserPenalized(ctx context.Context, in *IsUserPenalizedRequest, opts ...grpc.CallOption) (*IsUserPenalizedResponse, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(IsUserPenalizedResponse)
	err := c.cc.Invoke(ctx, PenaltyGapi_IsUserPenalized_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// PenaltyGapiServer is the server API for PenaltyGapi service.
// All implementations must embed UnimplementedPenaltyGapiServer
// for forward compatibility.
type PenaltyGapiServer interface {
	InsertPenalty(context.Context, *InsertPenaltyRequest) (*InsertPenaltyResponse, error)
	IsUserPenalized(context.Context, *IsUserPenalizedRequest) (*IsUserPenalizedResponse, error)
	mustEmbedUnimplementedPenaltyGapiServer()
}

// UnimplementedPenaltyGapiServer must be embedded to have
// forward compatible implementations.
//
// NOTE: this should be embedded by value instead of pointer to avoid a nil
// pointer dereference when methods are called.
type UnimplementedPenaltyGapiServer struct{}

func (UnimplementedPenaltyGapiServer) InsertPenalty(context.Context, *InsertPenaltyRequest) (*InsertPenaltyResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method InsertPenalty not implemented")
}
func (UnimplementedPenaltyGapiServer) IsUserPenalized(context.Context, *IsUserPenalizedRequest) (*IsUserPenalizedResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method IsUserPenalized not implemented")
}
func (UnimplementedPenaltyGapiServer) mustEmbedUnimplementedPenaltyGapiServer() {}
func (UnimplementedPenaltyGapiServer) testEmbeddedByValue()                     {}

// UnsafePenaltyGapiServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to PenaltyGapiServer will
// result in compilation errors.
type UnsafePenaltyGapiServer interface {
	mustEmbedUnimplementedPenaltyGapiServer()
}

func RegisterPenaltyGapiServer(s grpc.ServiceRegistrar, srv PenaltyGapiServer) {
	// If the following call pancis, it indicates UnimplementedPenaltyGapiServer was
	// embedded by pointer and is nil.  This will cause panics if an
	// unimplemented method is ever invoked, so we test this at initialization
	// time to prevent it from happening at runtime later due to I/O.
	if t, ok := srv.(interface{ testEmbeddedByValue() }); ok {
		t.testEmbeddedByValue()
	}
	s.RegisterService(&PenaltyGapi_ServiceDesc, srv)
}

func _PenaltyGapi_InsertPenalty_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(InsertPenaltyRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PenaltyGapiServer).InsertPenalty(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: PenaltyGapi_InsertPenalty_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PenaltyGapiServer).InsertPenalty(ctx, req.(*InsertPenaltyRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _PenaltyGapi_IsUserPenalized_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(IsUserPenalizedRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(PenaltyGapiServer).IsUserPenalized(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: PenaltyGapi_IsUserPenalized_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(PenaltyGapiServer).IsUserPenalized(ctx, req.(*IsUserPenalizedRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// PenaltyGapi_ServiceDesc is the grpc.ServiceDesc for PenaltyGapi service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var PenaltyGapi_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "penalty.PenaltyGapi",
	HandlerType: (*PenaltyGapiServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "InsertPenalty",
			Handler:    _PenaltyGapi_InsertPenalty_Handler,
		},
		{
			MethodName: "isUserPenalized",
			Handler:    _PenaltyGapi_IsUserPenalized_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "penalty.proto",
}
